import { useState } from 'react'
import Input from '../components/input'
import Layout from '../components/layout'
import Repo from '../components/repo'
import Menu from '../components/menu'
import MenuItem from '../components/menu-item'


export default function Home() {

  const [repos, setRepos] = useState([])
  const [stats, setStats] = useState({})

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    const body = new URLSearchParams(new FormData(event.target))
    fetch('/api/vulnerabilities', { method: 'POST', body })
      .then(response => response.json())
      .then(json => {
        setRepos(json.repos)
        setStats(json.stats)
      })
  }

  const toggleSettings = () => {
    const settings = document.getElementById('settings')
    settings.style.display = settings.style.display == 'none' ? 'grid' : 'none'
  }

  return (
    <Layout name='Viewer'>
      <Menu>
        <MenuItem><span onClick={toggleSettings}>Settings</span></MenuItem>
        <MenuItem><a href='https://github.com/nyg/dependabot-vuln-viewer' target='_blank'>Github</a></MenuItem>
      </Menu>

      <form method='post' onSubmit={retrieveVulnerabilities}>
        <div className='grid grid-cols-6 gap-x-3 mb-3' id='settings'>
          <Input className='col-span-2' name='githubApiUrl' label='Github API URL' defaultValue='https://api.github.com/graphql' />
          <Input className='col-span-2' name='githubApiToken' label='Github API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />
          <Input name='reposPerReq' label='Repos / request' defaultValue={50} />
          <Input name='vulnsPerReq' label='Vulns / request' defaultValue={3} />
        </div>

        <div className='flex items-end gap-x-3'>
          <Input className='flex-grow' name='repositories' label='Repositories' defaultValue={process.env.NEXT_PUBLIC_REPOS} />
          <button className='px-2 py-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500'>Search</button>
        </div>
      </form>

      {Object.keys(stats).length > 0 && (
        <p className='pl-3'>
          Searched {stats.fetchedRepoCount} of {stats.totalRepoCount} repositories, found {stats.vulnCount} vulnerabilities in {stats.vulnRepoCount} of them.{' '}
          {stats.hasMoreRepos && (
            <a href=''>Load more…</a>
          )}
        </p>
      )}

      <div className='space-y-6'>
        {repos.map(repo => <Repo key={repo.id} {...repo} />)}
      </div>
    </Layout>
  )
}
