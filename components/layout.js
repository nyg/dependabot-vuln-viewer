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

        <section className='flex-grow text-sm'>
          {children}
        </section>

        <footer className='text-xs text-center p-2 border-t border-gray-400'>
          <a href='https://github.com/nyg/dependabot-vuln-viewer'>Github</a>
        </footer>
      </main>
    </div >
  )
}
