import { gql } from "@apollo/client"

const VULN_ALERT_FRAGMENT = gql`
  fragment VulnerabilityAlerts on Repository {
    alerts: vulnerabilityAlerts(first: $vulnCount after: $lastVuln) {
      totalCount
      pageInfo {
        lastVuln: endCursor
        hasMoreVulns: hasNextPage
      }
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
  }`

export const SEARCH_REPOS = gql`
  ${VULN_ALERT_FRAGMENT}
  query SearchRepos($query: String!
                    $repoCount: Int! $lastRepo: String
                    $vulnCount: Int! $lastVuln: String) {
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
          name
          url
          owner {
            login
          }
          ...VulnerabilityAlerts
        }
      }
    }
  }`

export const FETCH_REPO = gql`
  ${VULN_ALERT_FRAGMENT}
  query FetchRepo($owner: String! $name: String!
                  $vulnCount: Int! $lastVuln: String) {
    repository(owner: $owner name: $name) {
      id
      ...VulnerabilityAlerts
    }
  }`
