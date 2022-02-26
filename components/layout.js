import Head from 'next/head'
import Menu from './menu/menu'


export default function Layout({ children, name }) {

   return (
      <div>
         <Head>
            <title>{name}</title>
            <link rel='icon' href='/favicon.ico' />
         </Head>

         <main className='flex flex-col w-[1024px] mx-auto pb-6'>
            <header className='pl-3 mt-1 mb-4 flex items-baseline gap-x-3'>
               <h1 className='text-xl'>Dependabot Vulnerability Viewer</h1>
               <span className='flex-grow'></span>
               <Menu />
            </header>

            <section className='flex-grow text-sm space-y-6'>
               {children}
            </section>
         </main>
      </div>
   )
}
