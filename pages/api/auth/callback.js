import { parseCookies } from '../../../utils/server'

const OAUTH_URL = process.env.GITHUB_OAUTH_URL || 'https://github.com'

export default async function handler(req, res) {
   const { code, state } = req.query

   if (!code) {
      return res.redirect('/?error=missing_code')
   }

   const cookies = parseCookies(req.headers.cookie)
   if (!state || state !== cookies.oauth_state) {
      return res.redirect('/?error=invalid_state')
   }

   let tokenData
   try {
      const tokenResponse = await fetch(`${OAUTH_URL}/login/oauth/access_token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code
         })
      })

      if (!tokenResponse.ok) {
         return res.redirect(`/?error=${encodeURIComponent('Failed to exchange code for token')}`)
      }

      tokenData = await tokenResponse.json()
   }
   catch {
      return res.redirect(`/?error=${encodeURIComponent('Failed to connect to GitHub')}`)
   }

   if (tokenData.error) {
      return res.redirect(`/?error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`)
   }

   // Short-lived non-httpOnly cookie so the client can transfer the token to localStorage
   const token = tokenData.access_token
   res.setHeader('Set-Cookie', [
      'oauth_state=; Max-Age=0; Path=/; SameSite=Lax; Secure; HttpOnly',
      `github_oauth_token=${encodeURIComponent(token)}; Path=/; Max-Age=60; SameSite=Lax; Secure`
   ])
   res.redirect('/')
}
