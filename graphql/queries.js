import { gql } from "@apollo/client"

export const FETCH_REPOS = gql`
  query FetchRepos($query: String!
                   $repoCount: Int! $lastRepo: String
                   $vulnCount: Int!) {
    search(type: REPOSITORY query: $query first: $repoCount after: $lastRepo) {
      pageInfo {
        lastRepo: endCursor
        hasMoreRepos: hasNextPage
      }
      totalRepoCount: repositoryCount
      fetchedRepoCount @client
      vulnCount @client
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
