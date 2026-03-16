function parseCookies(cookieHeader) {
   return (cookieHeader || '').split(';').reduce((acc, cookie) => {
      const [key, ...val] = cookie.trim().split('=')
      acc[key] = val.join('=')
      return acc
   }, {})
}

function cookieFlags() {
   const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
   return `; Path=/; SameSite=Lax${secure}`
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

   let tokenData
   try {
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

   const token = tokenData.access_token
   const flags = cookieFlags()
   res.setHeader('Set-Cookie', [
      `oauth_state=; Max-Age=0${flags}; HttpOnly`,
      `github_oauth_token=${encodeURIComponent(token)}; Max-Age=60${flags}`
   ])
   res.redirect('/')
}
