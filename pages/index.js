import { useState } from 'react'
import Input from '../components/input'
import Layout from '../components/layout'
import Repo from '../components/repo'


export default function Home() {

  const [repos, setRepos] = useState([])

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    const body = new URLSearchParams(new FormData(event.target))
    fetch('/api/vulnerabilities', { method: 'POST', body })
      .then(response => response.json())
      .then(json => {
        console.log(JSON.stringify(json.resp.data.search.nodes))
        console.log(json.resp.data.search.nodes)
        setRepos(json.resp.data.search.nodes)
      })
  }

  // const repos = JSON.parse('[{"owner":{"login":"nyg"},"name":"wiktionary-to-kindle","url":"https://github.com/nyg/wiktionary-to-kindle","vulnerabilityAlerts":{"totalCount":4,"nodes":[{"securityVulnerability":{"severity":"HIGH","package":{"name":"org.apache.commons:commons-compress"},"vulnerableVersionRange":"< 1.21","firstPatchedVersion":{"identifier":"1.21"},"advisory":{"summary":"Improper Handling of Length Parameter Inconsistency in Compress"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"org.apache.commons:commons-compress"},"vulnerableVersionRange":"< 1.21","firstPatchedVersion":{"identifier":"1.21"},"advisory":{"summary":"Excessive Iteration in Compress"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"org.apache.commons:commons-compress"},"vulnerableVersionRange":"< 1.21","firstPatchedVersion":{"identifier":"1.21"},"advisory":{"summary":"Improper Handling of Length Parameter Inconsistency in Compress"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"org.apache.commons:commons-compress"},"vulnerableVersionRange":"< 1.21","firstPatchedVersion":{"identifier":"1.21"},"advisory":{"summary":"Improper Handling of Length Parameter Inconsistency in Compress"}}}]}},{"owner":{"login":"nyg"},"name":"swissborg-stats","url":"https://github.com/nyg/swissborg-stats","vulnerabilityAlerts":{"totalCount":3,"nodes":[{"securityVulnerability":{"severity":"HIGH","package":{"name":"glob-parent"},"vulnerableVersionRange":"< 5.1.2","firstPatchedVersion":{"identifier":"5.1.2"},"advisory":{"summary":"Regular expression denial of service"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"jszip"},"vulnerableVersionRange":"< 3.7.0","firstPatchedVersion":{"identifier":"3.7.0"},"advisory":{"summary":"Prototype Pollution"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"ansi-regex"},"vulnerableVersionRange":"> 2.1.1, < 5.0.1","firstPatchedVersion":{"identifier":"5.0.1"},"advisory":{"summary":" Inefficient Regular Expression Complexity in chalk/ansi-regex"}}}]}},{"owner":{"login":"nyg"},"name":"heig","url":"https://github.com/nyg/heig","vulnerabilityAlerts":{"totalCount":68,"nodes":[{"securityVulnerability":{"severity":"MODERATE","package":{"name":"junit:junit"},"vulnerableVersionRange":">= 4.7, < 4.13.1","firstPatchedVersion":{"identifier":"4.13.1"},"advisory":{"summary":"TemporaryFolder on unix-like systems does not limit access to created files"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"kind-of"},"vulnerableVersionRange":">= 6.0.0, < 6.0.3","firstPatchedVersion":{"identifier":"6.0.3"},"advisory":{"summary":"Validation Bypass in kind-of"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"minimist"},"vulnerableVersionRange":">= 1.0.0, < 1.2.3","firstPatchedVersion":{"identifier":"1.2.3"},"advisory":{"summary":"Prototype Pollution in minimist"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"dot-prop"},"vulnerableVersionRange":"< 4.2.1","firstPatchedVersion":{"identifier":"4.2.1"},"advisory":{"summary":"Prototype Pollution in dot-prop"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"ini"},"vulnerableVersionRange":"< 1.3.6","firstPatchedVersion":{"identifier":"1.3.6"},"advisory":{"summary":"Prototype Pollution"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"glob-parent"},"vulnerableVersionRange":"< 5.1.2","firstPatchedVersion":{"identifier":"5.1.2"},"advisory":{"summary":"Regular expression denial of service"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"ws"},"vulnerableVersionRange":">= 5.0.0, < 5.2.3","firstPatchedVersion":{"identifier":"5.2.3"},"advisory":{"summary":"ReDoS in Sec-Websocket-Protocol header"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"ansi-regex"},"vulnerableVersionRange":"> 2.1.1, < 5.0.1","firstPatchedVersion":{"identifier":"5.0.1"},"advisory":{"summary":" Inefficient Regular Expression Complexity in chalk/ansi-regex"}}},{"securityVulnerability":{"severity":"HIGH","package":{"name":"kind-of"},"vulnerableVersionRange":">= 6.0.0, < 6.0.3","firstPatchedVersion":{"identifier":"6.0.3"},"advisory":{"summary":"Validation Bypass in kind-of"}}},{"securityVulnerability":{"severity":"MODERATE","package":{"name":"minimist"},"vulnerableVersionRange":"< 0.2.1","firstPatchedVersion":{"identifier":"0.2.1"},"advisory":{"summary":"Prototype Pollution in minimist"}}}]}}]')

  return (
    <Layout name='Viewer'>
      <form method='post' onSubmit={retrieveVulnerabilities}>
        <div className='grid grid-cols-2 gap-2'>
          <Input name='githubApiUrl' label='Github API URL' defaultValue='https://api.github.com/graphql' />
          <Input name='githubApiToken' label='Github API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />
          <Input name='repositories' label='Repositories' defaultValue={process.env.NEXT_PUBLIC_REPOS} className='col-span-2' >
            <button className='px-3 m-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500'>Search</button>
          </Input>
        </div>
      </form>
      <div>
        {repos.map(Repo)}
      </div>
    </Layout>
  )
}
