import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import SearchStatus from './search-status'
import { FETCH_REPOS } from '../../graphql/queries'
import Repository from '../table/repository'
import eventBus from '../../utils/event-bus'


export default function SearchResults() {

  const [gqlFetchRepos, { loading, error, data, fetchMore }] = useLazyQuery(FETCH_REPOS)

  const fetchRepos = ({ query, repoCount, vulnCount, uri, token }) =>
    gqlFetchRepos({
      variables: { query, repoCount, vulnCount },
      context: { uri, headers: { 'Authorization': `Bearer ${token}` } }
    })

  const fetchMoreRepos = ({ lastRepo }) =>
    fetchMore({ variables: { lastRepo } })

  useEffect(() => eventBus.on('search.form.submitted', fetchRepos), [])
  useEffect(() => eventBus.on('load.more.clicked', fetchMoreRepos), [])

  return (
    <>
      <SearchStatus loading={loading} error={error} data={data} />
      <div className='space-y-6'>
        {data && data.search.repos.map(repo => <Repository key={repo.id} {...repo} />)}
      </div>
    </>
  )
}
