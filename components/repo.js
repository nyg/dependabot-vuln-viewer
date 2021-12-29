import Vulnerability from "./vulnerability"


export default function Repo({ owner, name, url, alerts }) {

  return (
    <table className='border-collapse w-full border-t border-gray-700'>
      <caption className='text-left pl-3'>
        <a href={url}>{owner.login}/{name}</a>
        <span> ({alerts.totalCount} {alerts.totalCount > 1 ? 'vulnerabilities' : 'vulnerability'})</span>
      </caption>
      <thead>
        <tr className='text-xs'>
          <th></th>
          <th></th>
          <th className='text-left pt-2'>Affected Dependency</th>
          <th className='text-center pt-2'>Vulnerable</th>
          <th className='text-center pt-2'>Patched</th>
        </tr>
      </thead>
      <tbody>
        {alerts.nodes.map(alert => <Vulnerability key={alert.id} {...alert} />)}
      </tbody>
    </table>
  )
}
