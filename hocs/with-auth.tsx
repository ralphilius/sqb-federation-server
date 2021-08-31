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

function isWhitelisted(pathname: string): boolean{
  return ['/auth', '/404', '/403', '/500'].includes(pathname)
}

export const withAuth = ({
  WrappedComponent,
  LoadingComponent = PageLoading,
}: WithAuthProps ) => (props: WithChildren): JSX.Element => {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    console.log("useEffect", !loading && !user && !isWhitelisted(router.pathname));
    if (!loading && !user && !isWhitelisted(router.pathname)) {
      router.push('/auth')
    }
    
    if (!loading && user && router.pathname == '/auth') router.push('/')
  }, [user, loading])

  if ((loading && !user) || (!loading && !user && !isWhitelisted(router.pathname))) {
    return <LoadingComponent />
  }
  
  if((!loading && user && router.pathname != '/auth') || (!loading && !user && isWhitelisted(router.pathname))) return <WrappedComponent {...props} />;
  
  return <Page403 />
}