import { atom, useAtom } from "jotai"
import { useEffect } from "react";
import nookies from 'nookies';
import { AuthEvent, AuthProvider, AuthUser } from "../lib/IAuth";
import { SupabaseDatastore } from "../lib/SupabaseDatastore";
import { Session } from "@supabase/supabase-js";
import to from 'await-to-js';

const userAtom = atom<AuthUser | null>(null);
const userLoadingAtmom = atom(true);
const ds = new SupabaseDatastore();

export const useAuth = () => {
  const [user, setUser] = useAtom(userAtom);

  const [loading, setLoading] = useAtom(userLoadingAtmom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ; (window as any).nookies = nookies
    }

    const subscription = ds.onAuthStateChanged((event: AuthEvent, session: Session) => {
      if (session?.user) {
        setUser(session?.user);
        nookies.destroy(null, 'token');
        nookies.set(null, 'token', session?.access_token, { path: '/' });
      } else {
        setUser(null)
        nookies.destroy(null, 'token')
        nookies.set(null, 'token', '', { path: '/' })
      }
    });
    
    if (loading) setLoading(false)

    return () => {
      subscription.unsubscribe()
    }
  }, []);

  const signinWithProvider = async (provider: AuthProvider) => {
    return ds.signinWithProvider(provider);
  }

  const signinWithEmail = async (email: string, password?: string) => {
    return ds.signinWithEmail(email, password);
  }

  const signout = async () => {
    const [] = await to(ds.signout());
    setUser(null);
  }

  return {
    user,
    loading,
    signinWithProvider,
    signinWithEmail,
    signout
  }
}