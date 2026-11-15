import { useSyncExternalStore } from 'react'

import { isAuthenticated } from './auth'
import eventBus from './event-bus'

const noopSubscribe = () => () => {}
const authSubscribe = callback =>
   eventBus.on('auth.state.changed', () => callback())

// SSR-safe client detection: server snapshot returns false,
// client snapshot returns true, React handles the transition.
export const useIsClient = () =>
   useSyncExternalStore(noopSubscribe, () => true, () => false)

export const useAuthenticated = () =>
   useSyncExternalStore(authSubscribe, isAuthenticated, () => false)
