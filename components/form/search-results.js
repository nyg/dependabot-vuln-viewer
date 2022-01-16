import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import SearchStatus from './search-status'
import { FETCH_REPO, SEARCH_REPOS } from '../../graphql/queries'
import Repository from '../table/repository'
import eventBus from '../../utils/event-bus'
import { authHeader } from '../../utils/config'


export default function SearchResults() {

  const [gqlSearchRepos, { loading, error, data, fetchMore }] = useLazyQuery(SEARCH_REPOS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  })

  let settings
  const searchRepos = ({ query, repoCount, vulnCount, uri, token }) => {
    settings = { vulnCount, uri, token }
    gqlSearchRepos({
      variables: { query, repoCount, vulnCount },
      context: { uri, headers: authHeader(token) }
    })
  }

  const loadMoreRepos = variables =>
    fetchMore({ variables })

  const loadMoreVulns = variables => {
    fetchMore({
      query: FETCH_REPO,
      variables: { ...variables, vulnCount: settings.vulnCount },
      context: { uri: settings.uri, headers: authHeader(settings.token) }
    })
  }

  useEffect(() => eventBus.on('search.form.submitted', searchRepos), [])
  useEffect(() => eventBus.on('load.more.repos.clicked', loadMoreRepos), [])
  useEffect(() => eventBus.on('load.more.vulns.clicked', loadMoreVulns), [])

  return (
    <>
      <SearchStatus loading={loading} error={error} data={data} />
      <div className='space-y-6'>
        {data && data.search.repos.map(repo => <Repository key={repo.id} {...repo} />)}
      </div>
    </>
  )
}
