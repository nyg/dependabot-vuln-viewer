import Head from 'next/head'


export default function Layout({ children, name }) {

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col min-h-screen w-4/5 m-auto'>
        <header>
          <h1>Dependabot Vulnerability Viewer</h1>
        </header>

        <section className='flex-grow'>
          {children}
        </section>

        <footer className='text-xs text-center text-gray-600 p-4'>
          <a href='https://github.com/nyg/dependabot-vuln-viewer'>Github</a>
        </footer>
      </main>
    </div >
  )
}
