import '../styles/global.css'
import { ApolloProvider } from '@apollo/client'
import client from '../graphql/apollo'
import React from 'react'


export default function MyApp({ Component, pageProps }) {
   return (
      <ApolloProvider client={client}>
         <React.StrictMode>
            <Component {...pageProps} />
         </React.StrictMode>
      </ApolloProvider>
   )
}
