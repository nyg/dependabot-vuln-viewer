export default async function handler(req, res) {
   const { code, state } = req.query
   const redirectError = msg => res.redirect(`/?error=${encodeURIComponent(msg)}`)

   if (!code) {
      return redirectError('missing_code')
   }

   if (!state || state !== req.cookies.oauth_state) {
      return redirectError('invalid_state')
   }

   let tokenData
   try {
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL}/login/oauth/access_token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
         body: JSON.stringify({
            client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code
         })
      })

      if (!tokenResponse.ok) {
         return redirectError('Failed to exchange code for token')
      }

      tokenData = await tokenResponse.json()
   }
   catch {
      return redirectError('Failed to connect to GitHub')
   }

   if (tokenData.error) {
      return redirectError(tokenData.error_description || tokenData.error)
   }

   // `github_oauth_token` is a short-lived non-httpOnly cookie so the client
   // can transfer the token to localStorage to make request to GitHub GraphQL's
   // API directly from the browser.
   const token = tokenData.access_token
   res.setHeader('Set-Cookie', [
      'oauth_state=; Max-Age=0; Path=/; SameSite=Lax; Secure; HttpOnly',
      `github_oauth_token=${encodeURIComponent(token)}; Path=/; Max-Age=60; SameSite=Lax; Secure`
   ])
   res.redirect('/')
}
