import Link from 'next/link'

const Page403 = () => {
  return (
    <main
      className="min-h-screen bg-cover bg-top sm:bg-top"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1515284375698-b1988372314c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyOTg3ODExMw&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80")',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-sm font-semibold text-black text-opacity-50 uppercase tracking-wide">403 Forbidden</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Uh oh! I think you&apos;re lost.
        </h1>
        <p className="mt-2 text-lg font-medium text-black text-opacity-50">
          It looks like the page you&apos;re trying to access is not available to public.
        </p>
        <div className="mt-6">
          <Link href="/">
            <a
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black text-opacity-75 bg-white bg-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50"
            >
              Go back home
            </a>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Page403;