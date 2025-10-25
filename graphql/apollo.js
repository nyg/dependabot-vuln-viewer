import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from '@apollo/client'
import { LocalState } from "@apollo/client/local-state";
import { Query, Repository } from './apollo-policies'
import operationProcessingLink from './apollo-links'


export default new ApolloClient({
   link: ApolloLink.from([operationProcessingLink, new HttpLink()]),
   cache: new InMemoryCache({ typePolicies: { Query, Repository } }),
   localState: new LocalState({})
})
