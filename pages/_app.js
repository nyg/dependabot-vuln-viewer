import '../styles/global.css'

import { ApolloProvider } from '@apollo/client/react'
import React, { useEffect } from 'react'

import client from '../graphql/apollo'
import { transferOAuthToken } from '../utils/auth'
import { countPageView } from '../utils/hits'


export default function MyApp({ Component, pageProps }) {

   useEffect(() => {
      transferOAuthToken()
      countPageView()
   }, [])

   return (
      <ApolloProvider client={client}>
         <React.StrictMode>
            <Component {...pageProps} />
         </React.StrictMode>
      </ApolloProvider>
   )
}
