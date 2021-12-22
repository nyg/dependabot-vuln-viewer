export default function Home() {

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    const body = new URLSearchParams(new FormData(event.target))
    fetch('/api/vulnerabilities', { method: 'POST', body })
      .then(response => response.json())
      .then(json => console.log(json))
  }

  return (
    <>
      <form method='post' onSubmit={retrieveVulnerabilities}>
        <p>
          <label htmlFor='github-api-url'>Github API URL</label>
          <input type='text' id='github-api-url' name='githubApiUrl' defaultValue='https://api.github.com/graphql' />
        </p>
        <p>
          <label htmlFor='github-api-token'>Github API Token</label>
          <input type='password' id='github-api-token' name='githubApiToken' autoComplete="current-password" />
        </p>
        <p>
          <label htmlFor='repositories'>Repositories</label>
          <input type='text' id='repositories' name='repositories' />
        </p>
        <p>
          <button>Retrieve Vulnerabilites</button>
        </p>
      </form>
    </>
  )
}
