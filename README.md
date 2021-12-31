# Dependabot Vulnerability Viewer

*Work in progress… 🚧*

Uses GitHub's GraphQL API to query Dependabot vulnerability alerts of wanted
repositories.

The query string can be any valid [Advanced Search][] query string, e.g.:

* `user:<a GitHub user>`,
* `repo:<repo owner>/<repo name>`,
* etc.,
* any combination of the above.

See [here][] on how to create a personal access token.

![demo screenshot](/public/dvv-screen.png)

[Advanced Search]: https://github.com/search/advanced
[here]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

## Install & Run

```sh
npm install
npm run dev # localhost:3000
```

## Improvements

* Use Apollo
    * pagination for repos
    * error & loading handling
    * pagination for vuln?
* Show description of vuln
* Hosting on Vercel + OAuth login
    * impact for GH Enterprise?
    * store settings in localstorage
* Style
    * check spacing
    * improve table layout, remove caption
