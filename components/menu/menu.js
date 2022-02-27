import eventBus from '../../utils/event-bus'
import Link from '../link'
import MenuItem from './menu-item'


export default function Menu() {
   return (
      <>
         <MenuItem><span onClick={() => eventBus.dispatch('menu.item.settings.clicked')}>Settings</span></MenuItem>
         <MenuItem><Link href='https://github.com/nyg/dependabot-vuln-viewer'>Github</Link></MenuItem>
      </>
   )
}
