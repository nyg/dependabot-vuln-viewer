import { useEffect } from 'react'
import Input from './input'
import eventBus from '../../utils/event-bus'

const onSubmit = event => {
   event.preventDefault()
   eventBus.dispatch('search.form.submitted', {
      query: event.target.query.value,
      repoCount: parseInt(event.target.repoCount.value),
      vulnCount: parseInt(event.target.vulnCount.value),
      uri: event.target.githubApiUrl.value,
      token: event.target.githubApiToken.value
   })
}


export default function SearchForm() {

   useEffect(() =>
      eventBus.on('menu.item.settings.clicked', () => {
         const settings = document.getElementById('settings')
         settings.style.display = settings.style.display == 'none' ? 'grid' : 'none'
      }), [])

   return (
      <form method='post' onSubmit={onSubmit}>
         <div className='grid grid-cols-6 gap-x-3 mb-3' id='settings'>
            <Input className='col-span-2' name='githubApiUrl' label='Github API URL' defaultValue={process.env.NEXT_PUBLIC_API_URL} />
            <Input className='col-span-2' name='githubApiToken' label='Github API Token' defaultValue={process.env.NEXT_PUBLIC_API_TOKEN} type='password' />
            <Input name='repoCount' label='Repos / request' defaultValue={process.env.NEXT_PUBLIC_REPO_COUNT} />
            <Input name='vulnCount' label='Vulns / request' defaultValue={process.env.NEXT_PUBLIC_VULN_COUNT} />
         </div>

         <div className='flex items-end gap-x-3'>
            <Input className='flex-grow' name='query' label='Repositories' defaultValue={process.env.NEXT_PUBLIC_REPOS} />
            <button className='px-2 py-1 bg-gray-600 text-gray-100 rounded hover:bg-gray-500'>Search</button>
         </div>
      </form>
   )
}
