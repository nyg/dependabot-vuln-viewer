import { gql } from "@apollo/client"

export const FETCH_REPOS = gql`
  query FetchRepos($query: String! $repoCount: Int! $vulnCount: Int!) {
    search(query: $query type: REPOSITORY first: $repoCount) {
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
          alerts: vulnerabilityAlerts(first: $vulnCount) {
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
