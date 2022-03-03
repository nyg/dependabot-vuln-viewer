import { useEffect, useState } from 'react'
import eventBus from '../../utils/event-bus'


export default function SearchStatus({ loading, error, data }) {

   const [asyncStats, setAsyncStats] = useState({})
   useEffect(() => eventBus.on('async.stats.retrieved', setAsyncStats), [])

   if (loading) {
      return <p className='pl-3 italic'>Loading…</p>
   }
   else if (error) {
      console.error(error)
      return <p className='pl-3 text-red-600 font-semibold'>Error: {error.message}</p>
   }
   else if (data) {

      const vulnRepoCount = data.search.repos.length
      const { totalRepoCount, fetchedRepoCount, vulnCount } = data.search
      const { hasMoreRepos, lastRepo } = data.search.pageInfo
      const loadMore = () => eventBus.dispatch('load.more.repos.clicked', { lastRepo })

      const hasMoreReposText = hasMoreRepos
         ? <>, <a className='font-semibold cursor-pointer hover:underline' onClick={loadMore}>load more…</a></>
         : '.'

      const { inaccessibleRepos, alertsDisabledRepos, inaccessibleCount, disabledCount } = asyncStats
      const zeroVulnRepoCount = fetchedRepoCount - vulnRepoCount - inaccessibleCount - disabledCount
      const asyncStatsText = <>
         <br />Found {vulnRepoCount} with {vulnCount} vulnerabilities, {inaccessibleCount} with insufficient access, {disabledCount} with alerts disabled and {zeroVulnRepoCount} without vulnerabilities.
      </>

      return (
         <p className='pl-3'>
            Searched {fetchedRepoCount} of {totalRepoCount} repositories{hasMoreReposText}
            {Object.keys(asyncStats).length > 0 && asyncStatsText}
         </p>
      )
   }

   return <></>
}
