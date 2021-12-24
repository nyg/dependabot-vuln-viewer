import Input from '../components/input'
import Layout from '../components/layout'


export default function Home() {

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    const body = new URLSearchParams(new FormData(event.target))
    fetch('/api/vulnerabilities', { method: 'POST', body })
      .then(response => response.json())
      .then(json => console.log(json))
  }

  return (
    <Layout name='Viewer'>
      <div className=''>
        <form method='post' onSubmit={retrieveVulnerabilities}>
          <div className='grid grid-cols-2 gap-2'>
            <Input name='githubApiUrl' label='Github API URL' defaultValue='https://api.github.com/graphql' />
            <Input name='githubApiToken' label='Github API Token' type='password' />
            <Input name='repositories' label='Repositories' defaultValue='repo:nyg/dependabot-vuln-viewer user:vercel' className='col-span-2' />
            <button className='col-span-2 font-semibold text-left pl-3 hover:underline'>Retrieve Vulnerabilites</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
