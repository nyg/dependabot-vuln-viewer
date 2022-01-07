export default function SearchStatus({ loading, error, stats }) {

  if (loading) {
    return <p className='pl-3 italic'>Loading…</p>
  }

  if (error) {
    console.error(error)
    return <p className='pl-3 text-red-600 font-semibold'>Error: {error.message}</p>
  }

  if (Object.keys(stats).length) {
    return (
      <p className='pl-3'>
        Searched {stats.fetchedRepoCount} of {stats.totalRepoCount} repositories, found {stats.vulnCount} vulnerabilities in {stats.vulnRepoCount} of them.
        {stats.hasMoreRepos && (<a href=''>Load more…</a>)}
      </p>
    )
  }

  return (<></>)
}
