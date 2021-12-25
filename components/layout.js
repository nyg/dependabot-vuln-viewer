import Head from 'next/head'


export default function Layout({ children, name }) {

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col min-h-screen w-[1024px] mx-auto pb-8'>
        <header>
          <h1 className='pl-3 inline-block mr-3'>Dependabot Vulnerability Viewer</h1>
          <a className='text-xs text-gray-400' href='https://github.com/nyg/dependabot-vuln-viewer'>Github</a>
        </header>

        <section className='flex-grow text-sm space-y-8'>
          {children}
        </section>
      </main>
    </div >
  )
}
