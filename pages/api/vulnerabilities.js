import got from 'got'


export default async (req, res) => {

  const query = `{
    search(query: "${req.body.repositories}" type: REPOSITORY first: 40) {
      pageInfo {
        endCursor
        hasNextPage
      }
      repositoryCount
      nodes {
        ... on Repository {
          id
          owner {
            login
          }
          name
          url
          vulnerabilityAlerts(first: 15) {
            totalCount
            nodes {
              id
              securityAdvisory {
                summary
                description
                permalink
                identifiers { type value }
                cvss { score vectorString }
              }
              securityVulnerability {
                severity
                package { name }
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

  const repos = resp.data.search.nodes
    .filter(repo => repo.vulnerabilityAlerts.totalCount)
    .sort((repo, another) => another.vulnerabilityAlerts.totalCount - repo.vulnerabilityAlerts.totalCount)

  res.status(200).json({ repos })
}
