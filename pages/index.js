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
    <Layout name=''>
      <div className='border rounded-md border-gray-400 w-1/2'>
        <form method='post' onSubmit={retrieveVulnerabilities}>
          <div className='grid grid-cols-2'>
            <label htmlFor='github-api-url'>Github API URL</label>
            <input type='text' id='github-api-url' name='githubApiUrl' defaultValue='https://api.github.com/graphql' />
            <label htmlFor='github-api-token'>Github API Token</label>
            <input type='password' id='github-api-token' name='githubApiToken' autoComplete='current-password' />
            <label htmlFor='repositories'>Repositories</label>
            <input type='text' id='repositories' name='repositories' defaultValue='repo:nyg/dependabot-vuln-viewer user:vercel'/>
          </div>
          <div>
            <button>Retrieve Vulnerabilites</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
