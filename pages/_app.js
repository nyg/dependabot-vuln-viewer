import '../styles/global.css'
import { ApolloProvider } from '@apollo/client/react'
import client from '../graphql/apollo'
import React, { useEffect } from 'react'
import { transferOAuthToken } from '../utils/auth'


export default function MyApp({ Component, pageProps }) {

   useEffect(() => {
      transferOAuthToken()
   }, [])

   return (
      <ApolloProvider client={client}>
         <React.StrictMode>
            <Component {...pageProps} />
         </React.StrictMode>
      </ApolloProvider>
   )
}
