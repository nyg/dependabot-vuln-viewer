import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache } from '@apollo/client'
import { Query, Repository } from './type-policies'
import { sumVulnCount, vulnerableRepos } from '../utils/config'


const handleSearchReposOperation = response => {

   if (response.data) {
      // check if alerts are enabled for each repository
      // response.data.search.repos.forEach(({ owner: { login: owner }, name }) => {
      //    // console.log(`${owner}/${name}`)
      //    fetch(`https://api.github.com/repos/${owner}/${name}/vulnerability-alerts`, { headers: operation.getContext().headers })
      //       .then(response => console.log(response.status))
      //       .catch(reason => { console.log('rejected', reason) })
      // })

      // can/should this be done in the type policy?
      response.data.search.fetchedRepoCount = response.data.search.repos.length
      response.data.search.repos = response.data.search.repos.filter(vulnerableRepos)
      response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)
   }

   return response
}

const getHandler = operation => {
   switch (operation) {
      case 'SearchRepos': return handleSearchReposOperation
      default: return response => response
   }
}

const operationProcessingLink = new ApolloLink((operation, forward) => {
   return forward(operation).map(getHandler(operation.operationName))
})


export default new ApolloClient({
   link: from([operationProcessingLink, new HttpLink()]),
   cache: new InMemoryCache({
      typePolicies: { Query, Repository }
   })
})
