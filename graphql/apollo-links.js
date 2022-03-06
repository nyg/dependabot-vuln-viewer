import { isRepoAccessible, isRepoVulnerable, sumVulnCount } from '../utils/config'
import apolloClient from './apollo'
import { ApolloLink } from '@apollo/client'
import { WRITE_ALERTS_DISABLED_REPO } from './queries'


const groupByRepoType = (map, repo) => {
   const vulnKey = isRepoVulnerable(repo) ? 'vulnerable' : 'nonVulnerable'
   const key = isRepoAccessible(repo) ? vulnKey : 'inaccessible'
   map[key].push(repo)
   return map
}

// TODO fix uri for ghe
const fetchDependabotStatus = (repo, { uri, headers }) => ({
   repo,
   promise: fetch(`${uri.replace(/\/graphql/, '')}/repos/${repo.owner.login}/${repo.name}/vulnerability-alerts`, {
      method: 'HEAD', headers
   })
})

// TODO write repo first, then add reference
const writeRepoToCache = (alertsDisabledRepo, query) => {
   apolloClient.writeFragment({
      id: 'ROOT_QUERY',
      fragment: WRITE_ALERTS_DISABLED_REPO,
      data: { search: { alertsDisabledRepo } },
      variables: { query }
   })
}

const handleSearchReposOperation = (operation, response) => {

   if (response.data) {

      const repoMap = { vulnerable: [], nonVulnerable: [], inaccessible: [] }
      response.data.search.repos.reduce(groupByRepoType, repoMap)

      response.data.search.fetchedRepoCount = response.data.search.repos.length
      response.data.search.repos = repoMap.vulnerable
      response.data.search.inaccessibleRepos = repoMap.inaccessible
      response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)

      repoMap.nonVulnerable
         .map(repo => fetchDependabotStatus(repo, operation.getContext()))
         .forEach(({ repo, promise }) => promise.then(response => {
            if (response.status == 404) {
               writeRepoToCache(repo, operation.variables.query)
            }
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


export default new ApolloLink((operation, forward) => {
   return forward(operation).map(response => getHandler(operation, response))
})
