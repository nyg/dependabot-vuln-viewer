export default function Home() {

  const retrieveVulnerabilities = event => {

    event.preventDefault()

    console.log(document.forms.vuln.repositories.value)
    console.log(document.forms.vuln.githubApiUrl.value)
    console.log(document.forms.vuln.githubApiToken.value)

    fetch('/api/hello').then(response => response.json()).then(json => console.log(json))
  }

  return (
    <>
      <form name='vuln' method='post' onSubmit={retrieveVulnerabilities}>
        <p>
          <label htmlFor='github-api-url'>Github API URL</label>
          <input type='text' id='github-api-url' name='githubApiUrl' placeholder='https://api.github.com/graphql' />
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
