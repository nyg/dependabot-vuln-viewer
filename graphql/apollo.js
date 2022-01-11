import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'


const cacheOptions = {
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: ['query'],
          merge(existing = { nodes: [] }, incoming) {
            return {
              ...incoming,
              nodes: [...existing.nodes, ...incoming.nodes]
            }
          }
        }
      }
    }
  }
}

export default new ApolloClient({
  cache: new InMemoryCache(cacheOptions),
  link: new HttpLink()
})
