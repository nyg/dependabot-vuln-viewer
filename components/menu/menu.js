import MenuItem from "./menu-item"
import eventBus from "../../utils/event-bus"


export default function Menu() {
  return (
    <>
      <MenuItem><span onClick={() => eventBus.dispatch('menu.item.settings.clicked')}>Settings</span></MenuItem>
      <MenuItem><a href='https://github.com/nyg/dependabot-vuln-viewer' target='_blank'>Github</a></MenuItem>
    </>
  )
}
