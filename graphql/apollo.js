import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client'
import { hasAlertsDisabled, isRepoAccessible, isRepoVulnerable, sumVulnCount } from '../utils/config'
import { Query, Repository } from './type-policies'
import eventBus from '../utils/event-bus'


const fetchAlertsStatus = ({ owner: { login: owner }, name }, headers) =>
   fetch(`https://api.github.com/repos/${owner}/${name}/vulnerability-alerts`, { method: 'HEAD', headers })
      .then(response => ({ owner, name, alertsEnabled: response.status == 204 }))

const groupByRepoType = (map, repo) => {
   const vulnKey = isRepoVulnerable(repo) ? 'vulnerable' : 'nonVulnerable'
   const key = isRepoAccessible(repo) ? vulnKey : 'inaccessible'
   map[key].push(repo)
   return map
}

const handleSearchReposOperation = (operation, response) => {

   if (response.data) {

      const repoMap = { vulnerable: [], nonVulnerable: [], inaccessible: [] }
      response.data.search.repos.reduce(groupByRepoType, repoMap)

      response.data.search.fetchedRepoCount = response.data.search.repos.length
      response.data.search.repos = repoMap.vulnerable
      response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)

      const alertsStatusPromises = repoMap.nonVulnerable
         .map(repo => fetchAlertsStatus(repo, operation.getContext().headers))

      Promise.all(alertsStatusPromises)
         .then(repos => repos.filter(hasAlertsDisabled))
         .then(alertsDisabledRepos => eventBus.dispatch('async.stats.retrieved', {
            inaccessibleRepos: repoMap.inaccessible,
            inaccessibleCount: repoMap.inaccessible.length,
            alertsDisabledRepos,
            disabledCount: alertsDisabledRepos.length
         }))
   }

   return response
}

const getHandler = (operation, response) => {
   switch (operation.operationName) {
      case 'SearchRepos': return handleSearchReposOperation(operation, response)
      default: return response
   }
}

const operationProcessingLink = new ApolloLink((operation, forward) => {
   return forward(operation).map(response => getHandler(operation, response))
})


export default new ApolloClient({
   link: from([operationProcessingLink, new HttpLink()]),
   cache: new InMemoryCache({
      typePolicies: { Query, Repository }
   })
})
