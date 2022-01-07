import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import '../styles/global.css'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache()
})


export default function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
