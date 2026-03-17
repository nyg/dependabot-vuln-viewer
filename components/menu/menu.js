import { clearToken } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import { useAuthenticated } from '../../utils/hooks'
import Link from '../link'
import MenuItem from './menu-item'
import { useEffect, useState } from 'react'


export default function Menu() {

   const authenticated = useAuthenticated()
   const [oauthConfigured, setOauthConfigured] = useState(false)

   useEffect(() => {
      setOauthConfigured(!!process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL)
   }, [])

   const logout = () => {
      clearToken()
      eventBus.dispatch('auth.state.changed', { authenticated: false })
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
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>GitHub</Link></MenuItem>
      </>
   )
}
