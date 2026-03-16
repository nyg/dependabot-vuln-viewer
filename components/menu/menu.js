import { clearOAuthToken, getOAuthToken, isGitHubOAuthConfigured } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import Link from '../link'
import MenuItem from './menu-item'
import { useEffect, useState } from 'react'


export default function Menu() {

   const [oauthToken, setOauthToken] = useState(null)

   useEffect(() => {
      const token = getOAuthToken()
      if (token) setOauthToken(token)
   }, [])

   const handleLogout = () => {
      clearOAuthToken()
      window.location.reload()
   }

   return (
      <>
         {isGitHubOAuthConfigured() && (
            <MenuItem>
               {oauthToken
                  ? <span onClick={handleLogout}>Logout</span>
                  : <a href='/api/auth/login'>Login with GitHub</a>}
            </MenuItem>
         )}
         <MenuItem><span onClick={() => eventBus.dispatch('menu.item.settings.clicked')}>Settings</span></MenuItem>
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>Github</Link></MenuItem>
      </>
   )
}
