import React, { useEffect } from 'react'
import { useAuth } from '../hooks/use-auth'
import { useRouter } from 'next/router'
import { NextComponentType, NextPageContext } from 'next'
import PageLoading from '../components/page-loading'
import Page403 from '../pages/403';
import { WithChildren } from '../types'

type WithAuthProps = {
  WrappedComponent: NextComponentType<NextPageContext, any, {}>
  LoadingComponent?: NextComponentType<NextPageContext, any, {}>
}

export const withAuth = ({
  WrappedComponent,
  LoadingComponent = PageLoading,
}: WithAuthProps ) => (props: WithChildren): JSX.Element => {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!user && !loading && !['/auth', '/404', '/403', '/500'].includes(router.pathname)) {
      router.push('/auth')
    }
    
    if (user && !loading && router.pathname == '/auth') router.push('/')
  }, [user, loading])

  if (!user && loading) {
    return <LoadingComponent />
  }
  
  if(((user && !loading && router.pathname != '/auth') ||
  (!user && router.pathname == '/auth') || router.pathname == '/404')) return <WrappedComponent {...props} />;

  return <Page403 />
}