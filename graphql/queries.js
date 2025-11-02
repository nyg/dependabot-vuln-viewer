import { gql } from '@apollo/client'

const REPO_CORE = gql`
   fragment RepoCore on Repository {
      id
      name
      url
      owner {
         login
      }
   }`

const VULN_ALERT_FRAGMENT = gql`
   fragment VulnerabilityAlertsFragment on Repository {
      alerts: vulnerabilityAlerts(first: $vulnCount after: $lastVuln states: OPEN) {
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
   ${REPO_CORE}
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
         alertsDisabledRepos @client { ...RepoCore }
         inaccessibleRepos @client { ...RepoCore }
         repos: nodes {
            ... on Repository {
               ...RepoCore
               viewerPermission
               hasVulnerabilityAlertsEnabled
               ...VulnerabilityAlertsFragment
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
         ...VulnerabilityAlertsFragment
      }
   }`
