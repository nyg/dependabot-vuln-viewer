import { fetchAuthStatus } from '../../utils/auth'
import eventBus from '../../utils/event-bus'
import Input from './input'
import { useEffect, useState } from 'react'


export default function SearchForm() {

   const [authenticated, setAuthenticated] = useState(false)

   useEffect(() => {
      fetchAuthStatus().then(status => setAuthenticated(status.authenticated))
   }, [])

   useEffect(() =>
      eventBus.on('menu.item.settings.clicked', () => {
         const settings = document.getElementById('settings')
         settings.style.display = settings.style.display == 'none' ? 'grid' : 'none'
      }), [])

   const onSubmit = event => {
      event.preventDefault()
      eventBus.dispatch('search.form.submitted', {
         query: event.target.query.value,
         repoCount: parseInt(event.target.repoCount.value),
         vulnCount: parseInt(event.target.vulnCount.value),
         uri: event.target.githubApiUrl.value,
         token: authenticated ? null : (event.target.githubApiToken?.value || ''),
         useProxy: authenticated
      })
   }

   return (
      <form method='post' onSubmit={onSubmit}>
         <div className='grid grid-cols-6 gap-x-3 mb-3' id='settings'>
            <Input className='col-span-2' name='githubApiUrl' label='Github API URL' defaultValue={process.env.NEXT_PUBLIC_API_URL} />
            {authenticated
               ? <div className='col-span-2 grid grid-cols-1'>
                  <span className='px-3 pb-1 text-xs text-gray-800'>Github API Token</span>
                  <span className='px-3 py-1 text-xs text-green-700 bg-gray-200 rounded-sm'>✓ Authenticated via GitHub</span>
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
