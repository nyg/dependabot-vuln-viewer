import { severityImportance } from '../utils/config'


export const Query = {
   fields: {
      search: {
         keyArgs: ['query'],
         // how to merge repositories of two search results
         merge(existing = { fetchedRepoCount: 0, vulnCount: 0, nodes: [] }, incoming, { variables, readField }) {

            const vulnCount = repoRef =>
               readField({ fieldName: 'vulnerabilityAlerts', args: { first: variables.vulnCount }, from: repoRef }).totalCount

            const highestVulnCountFirst = (repoRef, anotherRepoRef) =>
               vulnCount(anotherRepoRef) - vulnCount(repoRef)

            return {
               ...incoming,
               nodes: existing.nodes.concat(incoming.nodes).sort(highestVulnCountFirst),
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
