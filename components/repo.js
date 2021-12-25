import Vulnerability from "./vulnerability"


export default function Repo({ id, owner, name, url, vulnerabilityAlerts: vulnerabilities }) {

  return (
    <table key={id} className='border-collapse w-full border border-black mt-3'>
      <caption className='text-left pl-3'>
        <a href={url}>`${owner.login}/${name}`</a>
        <span>vulnerabilities: {vulnerabilities.totalCount}</span>
      </caption>
      <thead>
        <tr className='text-xs'>
          <th></th>
          <th className='text-left'>Dependency</th>
          <th>Vulnerable versions</th>
          <th>Patched version</th>
        </tr>
      </thead>
      <tbody>
        {vulnerabilities.nodes.map(Vulnerability)}
      </tbody>
    </table>
  )
}