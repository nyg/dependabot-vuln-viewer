import { severityImportance } from '../utils/config'


const defaultSearchResult = {
   fetchedRepoCount: 0,
   vulnCount: 0,
   nodes: [],
   inaccessibleRepos: [],
   alertsDisabledRepos: []
}

export const Query = {
   fields: {
      search: {
         keyArgs: ['query'],
         // how to merge repositories of two search results
         merge(existing = defaultSearchResult, incoming, { variables, readField }) {

            if (incoming.alertsDisabledRepo) {
               const alertsDisabledRepos = existing.alertsDisabledRepos.concat(incoming.alertsDisabledRepo)
               return { ...existing, alertsDisabledRepos }
            }

            const vulnCount = repoRef =>
               readField({ fieldName: 'vulnerabilityAlerts', args: { first: variables.vulnCount }, from: repoRef }).totalCount

            const highestVulnCountFirst = (repoRef, anotherRepoRef) =>
               vulnCount(anotherRepoRef) - vulnCount(repoRef)

            return {
               ...incoming,
               nodes: existing.nodes.concat(incoming.nodes).sort(highestVulnCountFirst),
               inaccessibleRepos: existing.inaccessibleRepos.concat(incoming.inaccessibleRepos),
               alertsDisabledRepos: existing.alertsDisabledRepos,
               fetchedRepoCount: existing.fetchedRepoCount + incoming.fetchedRepoCount,
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
         // how to merge alerts of a repository
         merge(existing = { nodes: [] }, incoming, { readField }) {

            const severity = alertRef =>
               readField('securityVulnerability', alertRef).severity

            const highestSeverityFirst = (alertRef, anotherAlertRef) =>
               severityImportance[severity(anotherAlertRef)] - severityImportance[severity(alertRef)]

            return {
               ...incoming,
               nodes: existing.nodes.concat(incoming.nodes).sort(highestSeverityFirst)
            }
         }
      }
   }
}
