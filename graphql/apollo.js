import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from '@apollo/client'
import { vulnerableRepos, sumVulnCount } from '../utils/config'
import { Query, Repository } from './type-policies'


const handleSearchReposOperation = response => {

   if (response.data) {
      // check if alerts are enabled for each repository
      // response.data.search.repos.forEach(({ owner: { login: owner }, name }) => {
      //    // console.log(`${owner}/${name}`)
      //    fetch(`https://api.github.com/repos/${owner}/${name}/vulnerability-alerts`, { headers: operation.getContext().headers })
      //       .then(response => console.log(response.status))
      //       .catch(reason => { console.log('rejected', reason) })
      // })

      response.data.search.fetchedRepoCount = response.data.search.repos.length
      response.data.search.repos = response.data.search.repos.filter(vulnerableRepos)
      response.data.search.vulnCount = response.data.search.repos.reduce(sumVulnCount, 0)
   }

   return response
}

const handlers = {
   'SearchRepos': handleSearchReposOperation
}

const operationProcessingLink = new ApolloLink((operation, forward) => {
   return forward(operation).map(handlers[operation.operationName])
})


export default new ApolloClient({
   link: from([operationProcessingLink, new HttpLink()]),
   cache: new InMemoryCache({
      typePolicies: { Query, Repository }
   })
})
