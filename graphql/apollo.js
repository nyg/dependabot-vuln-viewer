import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { Query, Repository } from './apollo-policies'
import operationProcessingLink from './apollo-links'


export default new ApolloClient({
   link: from([operationProcessingLink, new HttpLink()]),
   cache: new InMemoryCache({ typePolicies: { Query, Repository } })
})
