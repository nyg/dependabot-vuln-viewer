import eventBus from './event-bus'
import { isAuthenticated } from './auth'
import { useEffect, useState } from 'react'

export const useAuthenticated = () => {
   const [authenticated, setAuthenticated] = useState(false)

   useEffect(() => {
      setAuthenticated(isAuthenticated())
   }, [])

   useEffect(() =>
      eventBus.on('auth.state.changed', ({ authenticated }) =>
         setAuthenticated(authenticated)), [])

   return authenticated
}
