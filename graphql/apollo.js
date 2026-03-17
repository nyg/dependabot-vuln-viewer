import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { Query, Repository } from './apollo-policies'
import { LocalState } from '@apollo/client/local-state'


const client = new ApolloClient({
   link: new HttpLink(),
   cache: new InMemoryCache({ typePolicies: { Query, Repository } }),
   localState: new LocalState()
})

export default client
