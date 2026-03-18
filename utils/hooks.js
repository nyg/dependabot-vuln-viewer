import eventBus from './event-bus'
import { isAuthenticated } from './auth'
import { useSyncExternalStore } from 'react'

const subscribe = callback =>
   eventBus.on('auth.state.changed', () => callback())

export const useAuthenticated = () =>
   useSyncExternalStore(subscribe, isAuthenticated, () => false)
