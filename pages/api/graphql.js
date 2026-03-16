export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
   }

   const auth = req.headers.authorization
   if (!auth) {
      return res.status(401).json({ error: 'Missing Authorization header' })
   }

   const targetUrl = req.headers['x-github-url']
   if (!targetUrl) {
      return res.status(400).json({ error: 'Missing X-GitHub-URL header' })
   }

   try {
      const response = await fetch(targetUrl, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
         },
         body: JSON.stringify(req.body)
      })

      const data = await response.json()
      res.status(response.status).json(data)
   }
   catch {
      res.status(502).json({ error: `Failed to proxy request to ${targetUrl}` })
   }
}
