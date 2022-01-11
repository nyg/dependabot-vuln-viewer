import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import SearchStatus from './search-status'
import { FETCH_REPOS } from '../../graphql/queries'
import Repository from '../table/repository'
import eventBus from '../../utils/event-bus'
import { vulnerableRepos, highestVulnCountFirst } from '../../utils/config'


export default function SearchResults() {

  const [gqlFetchRepos, { loading, error, data, fetchMore }] = useLazyQuery(FETCH_REPOS)

  const fetchRepos = ({ query, repoCount, vulnCount, uri, token }) =>
    gqlFetchRepos({
      variables: { query, repoCount, afterRepo: null, vulnCount },
      context: { uri, headers: { 'Authorization': `Bearer ${token}` } }
    })

  const fetchMoreRepos = ({ cursor: afterRepo }) => {
    fetchMore({ variables: { afterRepo } })
  }

  useEffect(() => eventBus.on('search.form.submitted', fetchRepos), [])
  useEffect(() => eventBus.on('load.more.clicked', fetchMoreRepos), [])

  let repos = []
  if (data) {
    repos = data.search.repos.filter(vulnerableRepos).sort(highestVulnCountFirst)
  }

  return (
    <>
      <SearchStatus loading={loading} error={error} data={data} repos={repos} />
      <div className='space-y-6'>
        {repos.map(repo => <Repository key={repo.id} {...repo} />)}
      </div>
    </>
  )
}
