import eventBus from '../../utils/event-bus'
import { getToken, isAuthenticated } from '../../utils/auth'
import Input from './input'
import { useEffect, useState } from 'react'


export default function SearchForm() {

   const [authenticated, setAuthenticated] = useState(false)

   useEffect(() => {
      setAuthenticated(isAuthenticated())
   }, [])

   useEffect(() =>
      eventBus.on('auth.state.changed', ({ authenticated }) =>
         setAuthenticated(authenticated)), [])

   useEffect(() =>
      eventBus.on('menu.item.settings.clicked', () => {
         const settings = document.getElementById('settings')
         settings.style.display = settings.style.display == 'none' ? 'grid' : 'none'
      }), [])

   const onSubmit = event => {
      event.preventDefault()
      const token = authenticated ? getToken() : (event.target.githubApiToken?.value || '')
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
         <div className='grid grid-cols-6 gap-x-3 mb-3' id='settings'>
            <Input className='col-span-2' name='githubApiUrl' label={authenticated ? 'Github API URL (linked to OAuth instance)' : 'Github API URL'} defaultValue={process.env.NEXT_PUBLIC_API_URL} disabled={authenticated} />
            {authenticated
               ? <div className='col-span-2 grid grid-cols-1 content-end'>
                  <span className='px-3 pb-1 text-xs text-gray-800'>Github API Token</span>
                  <span className='px-3 py-1 text-xs text-green-700 bg-gray-200 rounded-sm leading-5'>✓ Authenticated via GitHub OAuth</span>
               </div>
               : <Input className='col-span-2' name='githubApiToken' label='Github API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />
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
