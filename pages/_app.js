import { ApolloProvider } from '@apollo/client'
import client from '../graphql/apollo'
import '../styles/global.css'


export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
