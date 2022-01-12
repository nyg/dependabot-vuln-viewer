import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from '@apollo/client'
import { vulnerableRepos, sumVulnCount } from '../utils/config'

const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: ['query'],
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
  }
}

const fetchReposLink = new ApolloLink((operation, forward) => {

  const observable = forward(operation)
  if (operation.operationName !== 'FetchRepos') {
    return observable
  }

  return observable.map(response => {
    response.data.search.fetchedRepoCount = response.data.search.repos.length
    response.data.search.repos = response.data.search.repos.filter(vulnerableRepos)
    response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)
    return response
  })
})

export default new ApolloClient({
  cache: new InMemoryCache(cacheOptions),
  link: from([fetchReposLink, new HttpLink()])
})
