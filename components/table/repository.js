import Vulnerability from './vulnerability'
import eventBus from '../../utils/event-bus'
import Link from '../link'


export default function Repository({ owner: { login: owner }, name, url, alerts }) {

   const { hasMoreVulns, lastVuln } = alerts.pageInfo

   const loadMoreClicked = () =>
      eventBus.dispatch('load.more.vulns.clicked', { owner, name, lastVuln })

   return (
      <table className='border-collapse w-full'>
         <thead>
            <tr className='text-xs border-b border-b-gray-700'>
               <th className='text-left text-sm pl-3' colSpan='3'>
                  <Link className='font-semibold' href={`${url}/security/dependabot`}>{owner}/{name}</Link>
                  <span> ({alerts.totalCount} vulnerabilit{alerts.totalCount > 1 ? 'ies' : 'y'})</span>
               </th>
               <th className='text-center'>Vulnerable</th>
               <th className='text-center'>Patched</th>
            </tr>
         </thead>
         <tbody className='before:block before:h-2'>
            {alerts.nodes.map(alert => <Vulnerability key={alert.id} {...alert} />)}
         </tbody>
         {hasMoreVulns && (
            <tfoot>
               <tr>
                  <td colSpan={2}></td>
                  <td colSpan={3} className='font-[545] cursor-pointer hover:underline'>
                     <a onClick={loadMoreClicked}>load more…</a>
                  </td>
               </tr>
            </tfoot>
         )}
      </table>
   )
}
