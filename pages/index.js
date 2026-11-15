import SearchForm from '../components/form/search-form'
import SearchResults from '../components/form/search-results'
import Layout from '../components/layout'


export default function Home() {
   return (
      <Layout name='Vulnerability Viewer'>
         <SearchForm />
         <SearchResults />
      </Layout>
   )
}
