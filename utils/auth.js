const TOKEN_KEY = 'github_oauth_token'
const COOKIE_NAME = 'github_oauth_token'

export const getOAuthToken = () => {
   if (typeof window === 'undefined') return null

   // Check for token in cookie (set by OAuth callback redirect)
   const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1]

   if (cookieToken) {
      const token = decodeURIComponent(cookieToken)
      localStorage.setItem(TOKEN_KEY, token)
      // Clear the transfer cookie
      document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`
      return token
   }

   return localStorage.getItem(TOKEN_KEY)
}

export const clearOAuthToken = () => {
   if (typeof window === 'undefined') return
   localStorage.removeItem(TOKEN_KEY)
}

export const isGitHubOAuthConfigured = () =>
   !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
