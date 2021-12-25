import got from 'got'


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

  res.status(200).json({ repos })
}
