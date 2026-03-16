import { clearToken, isAuthenticated } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import Link from '../link'
import MenuItem from './menu-item'
import { useEffect, useState } from 'react'


export default function Menu() {

   const [authenticated, setAuthenticated] = useState(false)
   const [oauthConfigured, setOauthConfigured] = useState(false)

   useEffect(() => {
      setAuthenticated(isAuthenticated())
      setOauthConfigured(!!process.env.NEXT_PUBLIC_OAUTH_CONFIGURED)
   }, [])

   const logout = () => {
      clearToken()
      setAuthenticated(false)
      window.location.href = '/api/auth/logout'
   }

   return (
      <>
         {oauthConfigured && (
            <MenuItem>
               {authenticated
                  ? <span onClick={logout} className='cursor-pointer'>Logout</span>
                  : <a href='/api/auth/login'>Login with GitHub</a>}
            </MenuItem>
         )}
         <MenuItem><span onClick={() => eventBus.dispatch('menu.item.settings.clicked')}>Settings</span></MenuItem>
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>Github</Link></MenuItem>
      </>
   )
}
