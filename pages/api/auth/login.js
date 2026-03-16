import { randomBytes } from 'crypto'

export default function handler(req, res) {
   const githubOAuthUrl = process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL
   const clientId = process.env.GITHUB_OAUTH_CLIENT_ID

   if (!githubOAuthUrl || !clientId) {
      return res.status(500).json({ error: 'GitHub OAuth is not configured' })
   }

   const state = randomBytes(16).toString('hex')
   res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=600`)

   const params = new URLSearchParams({ client_id: clientId, scope: 'repo', state })
   res.redirect(`${githubOAuthUrl}/login/oauth/authorize?${params}`)
}
