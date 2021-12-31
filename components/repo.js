import Vulnerability from "./vulnerability"


export default function Repo({ owner, name, url, alerts }) {

  return (
    <table className='border-collapse w-full'>
      <thead>
        <tr className='text-xs border-b border-b-gray-700'>
          <th className='text-left text-sm pl-3' colSpan='3'>
            <a className='hover:underline font-semibold' href={url}>{owner.login}/{name}</a>
            <span> ({alerts.totalCount} {alerts.totalCount > 1 ? 'vulnerabilities' : 'vulnerability'})</span>
          </th>
          <th className='text-center'>Vulnerable</th>
          <th className='text-center'>Patched</th>
        </tr>
      </thead>
      <tbody className='before:block before:h-2'>
        {alerts.nodes.map(alert => <Vulnerability key={alert.id} {...alert} />)}
      </tbody>
    </table>
  )
}
