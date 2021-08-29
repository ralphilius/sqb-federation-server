import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { withAuth } from '../hocs/with-auth';
import { Router } from 'next/router';
import { SWRConfig } from 'swr';
import NProgress from 'nprogress';
import fetcher from '../lib/fetcher';

Router.events.on('routeChangeStart', (_url) => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  const ProtectedComponent = withAuth({
    WrappedComponent: Component,
  })

  return (
    <SWRConfig
      value={{
        fetcher: fetcher
      }}
    >
      <ProtectedComponent {...pageProps} />
    </SWRConfig>
  )
}
export default MyApp
