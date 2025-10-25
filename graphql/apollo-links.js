import { isRepoAccessible, isRepoVulnerable, sumVulnCount } from '../utils/config'
import apolloClient from './apollo'
import { ApolloLink } from '@apollo/client'
import { WRITE_ALERTS_DISABLED_REPO } from './queries'
import { map } from 'rxjs'


const groupByRepoType = (map, repo) => {
   const vulnKey = isRepoVulnerable(repo) ? 'vulnerable' : 'nonVulnerable'
   const key = isRepoAccessible(repo) ? vulnKey : 'inaccessible'
   map[key].push(repo)
   return map
}

const toRestUrl = graphQlUrl => {
   const isGHE = !graphQlUrl.includes('https://api.github.com')
   const restPath = isGHE ? '/v3' : ''
   return graphQlUrl.replace(/\/graphql/, restPath)
}

const fetchDependabotStatus = (repo, { uri: graphQlUrl, headers }) => {
   const restUrl = `${toRestUrl(graphQlUrl)}/repos/${repo.owner.login}/${repo.name}/vulnerability-alerts`
   const requestOptions = { method: 'HEAD', headers }
   return {
      repo,
      promise: fetch(restUrl, requestOptions)
   }
}

const writeRepoToCache = alertsDisabledRepo => {
   apolloClient.writeFragment({
      id: 'ROOT_QUERY',
      fragment: WRITE_ALERTS_DISABLED_REPO,
      data: { search: { alertsDisabledRepo } }
   })
}

const handleSearchReposResponse = (operation, response) => {

   if (response.data) {

      const repoMap = { vulnerable: [], nonVulnerable: [], inaccessible: [] }
      response.data.search.repos.reduce(groupByRepoType, repoMap)

      // keep track of how many repos were fetched, ignoring repo type
      response.data.search.fetchedRepoCount = response.data.search.repos.length

      // ignore non-vulnerable and inacessible repos
      response.data.search.repos = repoMap.vulnerable

      // store inaccessible repos in a separate field
      response.data.search.inaccessibleRepos = repoMap.inaccessible

      // count the total number of vulnerabilities across vulnerable repos
      response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)

      // a repo with no vulnerabilities might actually have dependabot alerts
      // disabled, to detect this we need to query the REST API on each of these
      // repos
      repoMap.nonVulnerable
         .map(repo => fetchDependabotStatus(repo, operation.getContext()))
         .forEach(({ repo, promise }) => promise.then(response => {
            if (response.status == 404) {
               writeRepoToCache(repo)
            }
         }))
   }

   return response
}

const getHandler = (operation, response) => {
   switch (operation.operationName) {
      case 'SearchRepos':
         return handleSearchReposResponse(operation, response)
      default:
         return response
   }
}


// Define a custom ApolloLink to be able to modify the response received from
// the GraphQL server.
export default new ApolloLink((operation, forward) => {
   // return forward(operation).map(response => getHandler(operation, response))
   return forward(operation).pipe(map(response => getHandler(operation, response)))
})
