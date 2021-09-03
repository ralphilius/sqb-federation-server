import { Session, User } from "@supabase/supabase-js";

export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'ID_TOKEN' | 'USER_UPDATED' | 'USER_DELETED' | 'PASSWORD_RECOVERY';

export interface Unsubscribe {
  unsubscribe(): void
}

export type AuthUser = User ;

export type AuthProvider = 'github' | 'google' | 'facebook' | 'discord' | 'twitter';

export type AuthOptions = {
  redirectTo?: string
  scopes?: string
}

export type AuthSession = Session;

export interface IAuth<U, S> {
  signinWithEmail(email: string, password?: string): Promise<U | null>;
  signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<S | null>;
  signout(): Promise<void>;
  onAuthStateChanged(callback: (event: AuthEvent, data: S) => void): Unsubscribe;
}
