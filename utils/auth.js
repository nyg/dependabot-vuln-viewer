import eventBus from './event-bus'

const TOKEN_KEY = 'github_oauth_token'
const COOKIE_NAME = 'github_oauth_token'

export const getToken = () =>
   typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null

export const setToken = token => {
   if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
   }
}

export const clearToken = () => {
   if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
   }
}

export const isAuthenticated = () => !!getToken()

// Picks up the short-lived transfer cookie set by the OAuth callback,
// saves the token to localStorage, and deletes the cookie.
export const transferOAuthToken = () => {
   console.log('transfering token')
   if (typeof document === 'undefined') return false
   const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
   if (!match) return false
   const token = decodeURIComponent(match[1])
   setToken(token)
   document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax; Secure`
   eventBus.dispatch('auth.state.changed', { authenticated: true })
   return true
}
