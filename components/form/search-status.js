import eventBus from '../../utils/event-bus'


export default function SearchStatus({ loading, error, data }) {

   if (loading) return <p className='pl-3 italic'>Loading…<br/>&nbsp;</p>
   if (error) return <p className='pl-3 text-red-600 font-semibold'>Error: {error.message}</p>

   if (data) {

      const { totalRepoCount, fetchedRepoCount, inaccessibleRepos, alertsDisabledRepos, vulnCount } = data.search
      const { hasMoreRepos, lastRepo } = data.search.pageInfo

      const vulnRepoCount = data.search.repos.length
      const inaccessibleCount = inaccessibleRepos.length
      const disabledCount = alertsDisabledRepos.length
      const zeroVulnRepoCount = fetchedRepoCount - vulnRepoCount - inaccessibleCount - disabledCount

      const loadMore = () => eventBus.dispatch('load.more.repos.clicked', { lastRepo })

      const hasMoreReposText = hasMoreRepos
         ? <>, <a className='font-semibold cursor-pointer hover:underline' onClick={loadMore}>load more…</a></>
         : '.'

      return (
         <p className='pl-3'>
            Searched {fetchedRepoCount} of {totalRepoCount} repositories{hasMoreReposText}<br />
            Found {vulnRepoCount} with {vulnCount} vulnerabilities, {inaccessibleCount} with insufficient access,{' '}
            {disabledCount} with alerts disabled and {zeroVulnRepoCount} without vulnerabilities.
         </p>
      )
   }

   return <></>
}
