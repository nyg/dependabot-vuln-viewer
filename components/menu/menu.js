import { clearToken } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import Link from '../link'
import MenuItem from './menu-item'
import { useAuthenticated } from '../../utils/hooks'


export default function Menu() {

   const authenticated = useAuthenticated()
   const oauthConfigured = !!process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL

   const logout = () => {
      clearToken()
      eventBus.dispatch('auth.state.changed', { authenticated: false })
   }

   return (
      <>
         {oauthConfigured && (
            <MenuItem>
               {authenticated
                  ? <button type='button' onClick={logout} className='btn-reset'>Logout</button>
                  // eslint-disable-next-line @next/next/no-html-link-for-pages -- API route, not a page
                  : <a href='/api/auth/login'>Login with GitHub</a>}
            </MenuItem>
         )}
         <MenuItem><button type='button' onClick={() => eventBus.dispatch('menu.item.settings.clicked')} className='btn-reset'>Settings</button></MenuItem>
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>GitHub</Link></MenuItem>
      </>
   )
}
