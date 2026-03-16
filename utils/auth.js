export const fetchAuthStatus = async () => {
   try {
      const res = await fetch('/api/auth/status')
      return await res.json()
   }
   catch {
      return { configured: false, authenticated: false }
   }
}
