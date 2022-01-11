import eventBus from '../../utils/event-bus'
import { sumVulnCount } from '../../utils/config'


export default function SearchStatus({ loading, error, data, repos }) {

  if (loading) {
    return <p className='pl-3 italic'>Loading…</p>
  }

  if (error) {
    console.error(error)
    return <p className='pl-3 text-red-600 font-semibold'>Error: {error.message}</p>
  }

  if (data) {

    const vulnCount = repos.reduce(sumVulnCount, 0)
    const vulnRepoCount = repos.length
    const totalRepoCount = data.search.repositoryCount
    const fetchedRepoCount = data.search.repos.length
    const hasMoreRepos = data.search.pageInfo.hasNextPage

    return (
      <p className='pl-3'>
        Searched {fetchedRepoCount} of {totalRepoCount} repositories, found {vulnCount} vulnerabilities in {vulnRepoCount} of them.{' '}
        {hasMoreRepos && (
          <a className='font-semibold hover:underline cursor-pointer' onClick={() => eventBus.dispatch('load.more.clicked', { cursor: data.search.pageInfo.endCursor })}>
            Load more…
          </a>
        )}
      </p>
    )
  }

  return (<></>)
}
