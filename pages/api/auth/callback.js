function parseCookies(cookieHeader) {
   return (cookieHeader || '').split(';').reduce((acc, cookie) => {
      const [key, ...val] = cookie.trim().split('=')
      acc[key] = val.join('=')
      return acc
   }, {})
}

export default async function handler(req, res) {
   const { code, state } = req.query

   if (!code) {
      return res.redirect('/?error=missing_code')
   }

   const cookies = parseCookies(req.headers.cookie)
   if (!state || state !== cookies.oauth_state) {
      return res.redirect('/?error=invalid_state')
   }

   const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
      },
      body: JSON.stringify({
         client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
         client_secret: process.env.GITHUB_CLIENT_SECRET,
         code
      })
   })

   const tokenData = await tokenResponse.json()

   if (tokenData.error) {
      return res.redirect(`/?error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`)
   }

   const token = tokenData.access_token
   res.setHeader('Set-Cookie', [
      'oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
      `github_oauth_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Max-Age=60`
   ])
   res.redirect('/')
}
