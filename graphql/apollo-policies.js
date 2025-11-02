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

            if (incoming.alertsDisabledRepo) {
               // Repositories with Dependabot alerts disabled are fetched
               // asynchronously when receiving the GraphQL response (custom
               // ApolloLink).
               const alertsDisabledRepos = existing.alertsDisabledRepos.concat(incoming.alertsDisabledRepo ?? [])
               return { ...existing, alertsDisabledRepos }
            }

            if (!loadMore) {
               // As we have disabled keyArgs, `existing' will not be empty if
               // some data exists in the cache, even when executing the
               // useLazyQuery hook a second time (i.e. not through its loadMore
               // function). So we manually clear the existing items so as to
               // reset the search.
               existing = emptySearchQueryResult
            }

            console.log(incoming)
            return {
               ...incoming,
               nodes: existing.nodes.concat(incoming.nodes ?? []).sort(highestVulnCountFirst),
               inaccessibleRepos: existing.inaccessibleRepos.concat(incoming.inaccessibleRepos ?? []),
               alertsDisabledRepos: existing.alertsDisabledRepos,
               fetchedRepoCount: existing.fetchedRepoCount + (incoming.fetchedRepoCount ?? 0),
               vulnCount: existing.vulnCount + incoming.vulnCount,
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
               nodes: existing.nodes.concat(incoming.nodes ?? []).sort(highestSeverityFirst)
            }
         }
      }
   }
}
