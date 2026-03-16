import { fetchAuthStatus } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import Link from '../link'
import MenuItem from './menu-item'
import { useEffect, useState } from 'react'


export default function Menu() {

   const [authStatus, setAuthStatus] = useState({ configured: false, authenticated: false })

   useEffect(() => {
      fetchAuthStatus().then(setAuthStatus)
   }, [])

   return (
      <>
         {authStatus.configured && (
            <MenuItem>
               {authStatus.authenticated
                  ? <a href='/api/auth/logout'>Logout</a>
                  : <a href='/api/auth/login'>Login with GitHub</a>}
            </MenuItem>
         )}
         <MenuItem><span onClick={() => eventBus.dispatch('menu.item.settings.clicked')}>Settings</span></MenuItem>
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>Github</Link></MenuItem>
      </>
   )
}
