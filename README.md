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

### Authentication

Two authentication methods are available (mutually exclusive):

1. **GitHub OAuth Login** (recommended): Click "Login with GitHub" in the top
   menu to authenticate via your GitHub account. Requires configuring a [GitHub
   OAuth App][oauth-app] (see below).

2. **Personal Access Token**: Enter a [personal access token][here] directly in
   the settings. Only the `repo` [scope][] is needed, or `public_repo` if you
   don't care about private repositories. Search settings are saved in browser
   `localStorage`, including the PAT, until you replace or clear them.

### Saved Settings

The app saves the search form values in browser `localStorage` and restores
them when you reload the page. This includes:

* the repository query
* the GitHub API URL
* the GitHub API token / PAT
* repos per request
* vulnerabilities per request

If you use the app on a shared machine, clear browser storage or remove the PAT
from settings before you leave the device.

### GitHub OAuth Setup

To enable the "Login with GitHub" option:

1. [Create a GitHub OAuth App][oauth-app] in your GitHub settings.
2. Set the **Authorization callback URL** to
   `<your-app-url>/api/auth/callback`.
3. Configure the following environment variables:
   ```
   GITHUB_OAUTH_CLIENT_ID=<your-client-id>
   GITHUB_OAUTH_CLIENT_SECRET=<your-client-secret>
   NEXT_PUBLIC_GITHUB_OAUTH_URL=<github-oauth-base-url>
   ```
   where `<github-oauth-base-url>` is the base URL of the GitHub OAuth
   endpoint (for example, `https://github.com/login/oauth`).

If these variables are not set, the OAuth option will not appear and the app
will work as before using only personal access tokens.

## Install & Run

```sh
git clone https://github.com/nyg/dependabot-vuln-viewer.git
cd dependabot-vuln-viewer
pnpm install
pnpm dev # localhost:3000
```

[dependabot-vuln-viewer.vercel.app]: https://dependabot-vuln-viewer.vercel.app/
[Advanced Search]: https://github.com/search/advanced
[etc.]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax
[here]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
[scope]: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
[oauth-app]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
