import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from '@apollo/client'
import { vulnerableRepos, sumVulnCount } from '../utils/config'
import { Query, Repository } from './type-policies'


const searchReposProcessingLink = new ApolloLink((operation, forward) => {

  if (operation.operationName === 'SearchRepos') {
    return forward(operation).map(response => {
      if (response.data) {
        response.data.search.fetchedRepoCount = response.data.search.repos.length
        response.data.search.repos = response.data.search.repos.filter(vulnerableRepos)
        response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)
      }

      return response
    })
  }

  return forward(operation)
})

const cache = new InMemoryCache({
  typePolicies: { Query, Repository }
})


export default new ApolloClient({
  link: from([searchReposProcessingLink, new HttpLink()]),
  cache
})
