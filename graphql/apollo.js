import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'
import { LocalState } from '@apollo/client/local-state'
import { Query, Repository } from './apollo-policies'


export default new ApolloClient({
   link: new HttpLink(),
   cache: new InMemoryCache({ typePolicies: { Query, Repository } }),
   localState: new LocalState()
})
