import eventBus from '../../utils/event-bus'


export default function SearchStatus({ loading, error, data }) {

  if (loading) {
    return <p className='pl-3 italic'>Loading…</p>
  }

  if (error) {
    console.error(error)
    return <p className='pl-3 text-red-600 font-semibold'>Error: {error.message}</p>
  }

  if (data) {

    const vulnRepoCount = data.search.repos.length
    const { totalRepoCount, fetchedRepoCount, vulnCount } = data.search
    const { hasMoreRepos, lastRepo } = data.search.pageInfo
    const loadMoreClicked = () => eventBus.dispatch('load.more.repos.clicked', { lastRepo })

    return (
      <p className='pl-3'>
        Searched {fetchedRepoCount} of {totalRepoCount} repositories, found {vulnCount} vulnerabilities in {vulnRepoCount} of them.
        {hasMoreRepos && (
          <>{' '}<a className='font-semibold cursor-pointer hover:underline' onClick={loadMoreClicked}>Load more…</a></>
        )}
      </p>
    )
  }

  return <></>
}
