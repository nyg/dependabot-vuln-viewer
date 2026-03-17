import { loadSettings, saveSettings } from '../../utils/settings'
import { useEffect, useState } from 'react'

import eventBus from '../../utils/event-bus'
import { getToken } from '../../utils/auth'
import Input from './input'
import { useAuthenticated } from '../../utils/hooks'


export default function SearchForm() {

   const authenticated = useAuthenticated()
   const [error, setError] = useState(() => {
      if (typeof window === 'undefined') {
         return null
      }
      return new URLSearchParams(window.location.search).get('error')
   })

   useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      if (params.has('error')) {
         params.delete('error')
         const newUrl = params.size ? `${window.location.pathname}?${params}` : window.location.pathname
         history.replaceState(null, '', newUrl)
      }
   }, [])

   useEffect(() => {
      const settings = loadSettings()
      if (settings) {
         for (const [key, value] of Object.entries(settings)) {
            const el = document.getElementById(key)
            if (el && !el.disabled) {
               el.value = value
            }
         }
      }
   }, [])

   useEffect(() =>
      eventBus.on('menu.item.settings.clicked', () => {
         const settings = document.getElementById('settings')
         settings.style.display = settings.style.display == 'none' ? 'grid' : 'none'
      }), [])

   const onSubmit = event => {
      event.preventDefault()
      const token = authenticated ? getToken() : (event.target.githubApiToken?.value || '')
      saveSettings({
         query: event.target.query.value,
         githubApiUrl: event.target.githubApiUrl.value,
         githubApiToken: event.target.githubApiToken?.value || '',
         repoCount: event.target.repoCount.value,
         vulnCount: event.target.vulnCount.value,
      })
      eventBus.dispatch('search.form.submitted', {
         query: event.target.query.value,
         repoCount: parseInt(event.target.repoCount.value),
         vulnCount: parseInt(event.target.vulnCount.value),
         uri: event.target.githubApiUrl.value,
         token,
      })
   }

   return (
      <form method='post' onSubmit={onSubmit}>
         {error && (
            <div className='flex items-center justify-between mb-3 px-3 py-2 text-xs text-red-800 bg-red-100 rounded-sm'>
               <span>Authentication error: {error}</span>
               <button type='button' onClick={() => setError(null)} className='btn-reset text-red-400 hover:text-red-600'>✕</button>
            </div>
         )}
         <div className='grid grid-cols-6 gap-x-3 mb-3' id='settings'>
            <Input className='col-span-2' name='githubApiUrl' label={authenticated ? 'GitHub API URL (linked to OAuth instance)' : 'GitHub API URL'} defaultValue={process.env.NEXT_PUBLIC_API_URL} disabled={authenticated} />
            {authenticated
               ? <div className='col-span-2 grid grid-cols-1 content-end'>
                  <span className='px-3 pb-1 text-xs text-gray-800'>GitHub API Token</span>
                  <span className='px-3 py-1 text-xs text-green-700 bg-gray-200 rounded-sm leading-5'>✓ Authenticated via GitHub OAuth</span>
               </div>
               : <Input className='col-span-2' name='githubApiToken' label='GitHub API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />
            }
            <Input name='repoCount' label='Repos / request' defaultValue={process.env.NEXT_PUBLIC_REPO_COUNT} />
            <Input name='vulnCount' label='Vulns / request' defaultValue={process.env.NEXT_PUBLIC_VULN_COUNT} />
         </div>

         <div className='flex items-end gap-x-3'>
            <Input className='grow' name='query' label='Repositories' defaultValue={process.env.NEXT_PUBLIC_REPOS} />
            <button className='px-2 py-1 bg-gray-600 text-gray-100 rounded-sm hover:bg-gray-500'>Search</button>
         </div>
      </form>
   )
}
