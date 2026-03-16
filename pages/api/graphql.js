function parseCookies(cookieHeader) {
   return (cookieHeader || '').split(';').reduce((acc, cookie) => {
      const [key, ...val] = cookie.trim().split('=')
      acc[key] = val.join('=')
      return acc
   }, {})
}

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
   }

   const cookies = parseCookies(req.headers.cookie)
   const token = cookies.github_oauth_token
      ? decodeURIComponent(cookies.github_oauth_token)
      : null

   if (!token) {
      return res.status(401).json({ error: 'Not authenticated' })
   }

   try {
      const response = await fetch('https://api.github.com/graphql', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(req.body)
      })

      const data = await response.json()
      res.status(response.status).json(data)
   }
   catch {
      res.status(502).json({ error: 'Failed to proxy request to GitHub API' })
   }
}
