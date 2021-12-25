import Head from 'next/head'


export default function Layout({ children, name }) {

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col min-h-screen w-[768px] mx-auto'>
        <header>
          <h1 className='pl-3'>Dependabot Vulnerability Viewer</h1>
        </header>

        <section className='flex-grow text-sm space-y-8'>
          {children}
        </section>

        <footer className='p-1 text-xs text-center text-gray-500 hover:text-gray-900 border-t border-gray-400'>
          <a href='https://github.com/nyg/dependabot-vuln-viewer'>Github</a>
        </footer>
      </main>
    </div >
  )
}
