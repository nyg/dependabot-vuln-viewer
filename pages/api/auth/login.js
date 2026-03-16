import { randomBytes } from 'crypto'

export default function handler(req, res) {
   const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
   if (!clientId) {
      return res.status(500).json({ error: 'GitHub OAuth is not configured' })
   }

   const state = randomBytes(16).toString('hex')
   const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
   res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`)

   const params = new URLSearchParams({
      client_id: clientId,
      scope: 'repo',
      state
   })

   res.redirect(`https://github.com/login/oauth/authorize?${params}`)
}
