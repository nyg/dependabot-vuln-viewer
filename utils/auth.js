export const fetchAuthStatus = async () => {
   try {
      const res = await fetch('/api/auth/status')
      return await res.json()
   }
   catch {
      return { configured: false, authenticated: false }
   }
}

export const parseCookies = cookieHeader =>
   (cookieHeader || '').split(';').reduce((acc, cookie) => {
      const [key, ...val] = cookie.trim().split('=')
      acc[key] = val.join('=')
      return acc
   }, {})
