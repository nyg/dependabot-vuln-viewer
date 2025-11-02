import { severityImportance } from '../utils/config'


const emptySearchQueryResult = {
   fetchedRepoCount: 0,
   vulnCount: 0,
   nodes: [],
   inaccessibleRepos: [],
   alertsDisabledRepos: []
}

const emptyVulnQueryResult = {
   nodes: []
}


// Query is defined in the GraphQL schema and has multiple fields such as
// `search', `repository', etc.
export const Query = {
   fields: {
      search: {
         keyArgs: false,

         // Defines how an incoming SearchResultItemConnection (the return type
         // of `search') should be merged with the one already existing in the
         // cache.
         merge(existing = emptySearchQueryResult, incoming, { variables: { vulnCount, lastRepo: loadMore }, readField }) {

            const countVuln = repo =>
               readField({ fieldName: 'vulnerabilityAlerts', args: { first: vulnCount }, from: repo }).totalCount

            const highestVulnCountFirst = (repo, anotherRepo) =>
               countVuln(anotherRepo) - countVuln(repo)

            const repoMap = incoming.nodes.reduce(
               (map, repo) => {
                  const isRepoAccessible = readField('viewerPermission', repo) === 'ADMIN'
                  const areAlertsEnabled = readField('hasVulnerabilityAlertsEnabled', repo) === true
                  const isRepoVulnerable = countVuln(repo)

                  if (!isRepoAccessible) {
                     map.inaccessible.push(repo)
                  }
                  else if (!areAlertsEnabled) {
                     map.disabled.push(repo)
                  }
                  else if (isRepoVulnerable) {
                     map.vulnerable.push(repo)
                  }
                  else {
                     map.nonVulnerable.push(repo)
                  }

                  return map
               },
               { nonVulnerable: [], vulnerable: [], disabled: [], inaccessible: [] })

            // keep track of how many repos were fetched, ignoring repo type
            const fetchedRepoCount = incoming.nodes.length

            const totalVulnCount = repoMap.vulnerable.reduce(
               (sum, repo) => sum + countVuln(repo), 0)

            if (!loadMore) {
               // As we have disabled keyArgs, `existing' will not be empty if
               // some data exists in the cache, even when executing the
               // useLazyQuery hook a second time (i.e. not through its loadMore
               // function). So we manually clear the existing items so as to
               // reset the search.
               existing = emptySearchQueryResult
            }

            return {
               ...incoming,
               nodes: existing.nodes.concat(repoMap.vulnerable).sort(highestVulnCountFirst),
               inaccessibleRepos: existing.inaccessibleRepos.concat(repoMap.inaccessible),
               alertsDisabledRepos: existing.alertsDisabledRepos.concat(repoMap.disabled),
               fetchedRepoCount: existing.fetchedRepoCount + fetchedRepoCount,
               vulnCount: existing.vulnCount + totalVulnCount,
            }
         }
      }
   }
}

export const Repository = {
   fields: {
      vulnerabilityAlerts: {
         keyArgs: false,

         // Defines how to merge the vulnerabilityAlerts field of two identical
         // Repository (one existing in the cache, one coming from the GraphQL
         // response).
         merge(existing = emptyVulnQueryResult, incoming, { readField, variables: { lastVuln: loadMore } }) {

            const severity = alert =>
               readField('securityVulnerability', alert).severity

            const highestSeverityFirst = (alert, anotherAlert) =>
               severityImportance[severity(anotherAlert)] - severityImportance[severity(alert)]

            if (!loadMore) {
               existing = emptyVulnQueryResult
            }

            return {
               ...incoming,
               nodes: existing.nodes.concat(incoming.nodes).sort(highestSeverityFirst)
            }
         }
      }
   }
}
