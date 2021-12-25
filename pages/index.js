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
      .then(json => setRepos(json.repos))
  }

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
