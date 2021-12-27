import got from 'got'

const severityImportance = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 }

const highestSeverityFirst = ({ vuln }, { vuln: another }) =>
  severityImportance[another.severity] - severityImportance[vuln.severity]


export default async (req, res) => {

  const query = `{
    search(query: "${req.body.repositories}" type: REPOSITORY first: 50) {
      pageInfo {
        endCursor
        hasNextPage
      }
      repositoryCount
      repos: nodes {
        ... on Repository {
          id
          owner {
            login
          }
          name
          url
          alerts: vulnerabilityAlerts(first: 15) {
            totalCount
            nodes {
              id
              advisory: securityAdvisory {
                summary
                description
                permalink
                identifiers { type value }
                cvss { score vectorString }
              }
              vuln: securityVulnerability {
                severity
                package { ecosystem name }
                vulnerableVersionRange
                firstPatchedVersion { identifier }
              }
            }
          }
        }
      }
    }
  }`

  const resp = await got.post(req.body.githubApiUrl, {
    headers: { Authorization: `Bearer ${req.body.githubApiToken}` },
    body: JSON.stringify({ query })
  }).json()

  const repos = resp.data.search.repos
    .filter(repo => repo.alerts.totalCount)
    .sort((repo, another) => another.alerts.totalCount - repo.alerts.totalCount)

  const vulnCount = repos
    .map(repo => repo.alerts.totalCount)
    .reduce((a, b) => a + b, 0)

  repos.map(repo => repo.alerts.nodes.sort(highestSeverityFirst))

  res.status(200).json({
    repos,
    stats: {
      repoCount: resp.data.search.repos.length,
      vulnRepoCount: repos.length,
      vulnCount,
      hasMoreRepos: resp.data.search.pageInfo.hasNextPage
    }
  })
}
