# Dependabot Vulnerability Viewer

Displays Dependabot vulnerability alerts of multiple repositories on a single
page. Only vulnerabilities of repositories that your personal access token has
access to will be displayed (restriction of GitHub's GraphQL API).

## Demo

Hosted at [dependabot-vuln-viewer.vercel.app][].

> *Disclaimer*: Your personal access token is, in theory, never sent to the
> server (the GraphQL API request is made by the browser). However, due to the
> magic behind Next.js and Apollo Client, I cannot guarantee it. Feel free to
> clone the repo and run it in local. Let me know if you know more than I do on
> this subject.

![demo screenshot](/public/dvv-screen.png)

### Query String

Can be any valid [advanced search][] query string:

* `user:<a GitHub user>`,
* `repo:<repo owner>/<repo name>`,
* [etc.][],
* any combination of the above.

### Personal Access Token

See [here][] to create a personal access token for the GitHub API. Only the
`repo` [scope][] is needed, or `public_repo` if you don't care about your
private repositories.

## Install & Run

```sh
git clone https://github.com/nyg/dependabot-vuln-viewer.git
cd dependabot-vuln-viewer
npm install
npm run dev # localhost:3000
```

## Improvements

* Display description of vulnerabilities
* Add OAuth login
    * GitHub Enterprise (?)
* Store settings in `localstorage`

[dependabot-vuln-viewer.vercel.app]: https://dependabot-vuln-viewer.vercel.app/
[Advanced Search]: https://github.com/search/advanced
[etc.]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax
[here]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
[scope]: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
