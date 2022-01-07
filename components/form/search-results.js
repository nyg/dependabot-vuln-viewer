import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import SearchStatus from './search-status'
import { FETCH_REPOS } from '../../graphql/queries'
import Repository from '../table/repository'
import eventBus from '../../utils/event-bus'
import { vulnerableRepos, highestVulnCountFirst, sumVulnCount } from '../../utils/config'


export default function SearchResults() {

  const [gqlFetchRepos, { loading, error, data }] = useLazyQuery(FETCH_REPOS)

  const fetchRepos = ({ query, repoCount, vulnCount, uri, token }) =>
    gqlFetchRepos({
      variables: { query, repoCount, vulnCount },
      context: { uri, headers: { 'Authorization': `Bearer ${token}` } }
    })

  useEffect(() => eventBus.on('search.form.submitted', fetchRepos), [])

  let repos = []
  const stats = {}

  if (data) {
    repos = data.search.repos.filter(vulnerableRepos).sort(highestVulnCountFirst)

    stats.vulnCount = repos.reduce(sumVulnCount, 0)
    stats.vulnRepoCount = repos.length
    stats.totalRepoCount = data.search.repositoryCount
    stats.fetchedRepoCount = data.search.repos.length
    stats.hasMoreRepos = data.search.pageInfo.hasNextPage
  }

  return (
    <>
      <SearchStatus loading={loading} error={error} stats={stats} />
      <div className='space-y-6'>
        {repos.map(repo => <Repository key={repo.id} {...repo} />)}
      </div>
    </>
  )
}
