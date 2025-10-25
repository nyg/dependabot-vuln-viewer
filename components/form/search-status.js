import eventBus from '../../utils/event-bus'
import { Fragment } from 'react'
import Link from '../link'
import Tooltip from '../tooltip'


const repoToLink = ({ owner: { login: owner }, name, url, id }) =>
   <Fragment key={id}><Link href={`${url}`}>{owner}/{name}</Link><br /></Fragment>

const byOwnerAndName = ({ url }, { url: anotherUrl }) => url.localeCompare(anotherUrl)
const toTooltip = repos => [...repos].sort(byOwnerAndName).map(repo => {
   console.log(repo)
   return repoToLink(repo)
})

export default function SearchStatus({ loading, error, data }) {

   if (loading) return <p className='pl-3 italic'>Loading…<br />&nbsp;</p>
   if (error) return <p className='pl-3 text-red-600 font-semibold'>{error.message}</p>

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
         <div className='pl-3'>
            Searched {fetchedRepoCount} of {totalRepoCount} repositories{hasMoreReposText}<br />
            Found {vulnRepoCount} repositories with {vulnCount} vulnerabilities,{' '}
            <Tooltip enabled={inaccessibleCount} value={toTooltip(inaccessibleRepos)}>{inaccessibleCount} with insufficient access</Tooltip>,{' '}
            <Tooltip enabled={disabledCount} value={toTooltip(alertsDisabledRepos)}>{disabledCount} with alerts disabled</Tooltip>{' '}
            and {zeroVulnRepoCount} without vulnerabilities.
         </div>
      )
   }

   return <></>
}
