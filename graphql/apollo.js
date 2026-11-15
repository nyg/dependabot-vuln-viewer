import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { LocalState } from '@apollo/client/local-state'

import { Query, Repository } from './apollo-policies'


const client = new ApolloClient({
   link: new HttpLink(),
   cache: new InMemoryCache({ typePolicies: { Query, Repository } }),
   localState: new LocalState()
})

export default client
