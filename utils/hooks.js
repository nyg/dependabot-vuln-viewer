import { useEffect, useState } from 'react'
import eventBus from './event-bus'
import { isAuthenticated } from './auth'

export const useAuthenticated = () => {
   const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

   useEffect(() => {
      return eventBus.on('auth.state.changed', ({ authenticated }) =>
         setAuthenticated(authenticated))
   }, [])

   return authenticated
}
