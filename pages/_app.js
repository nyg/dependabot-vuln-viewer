import { ApolloProvider } from '@apollo/client'
import React from 'react'
import client from '../graphql/apollo'
import '../styles/global.css'


export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
    </ApolloProvider>
  )
}
