export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'ID_TOKEN' | 'USER_UPDATED' | 'USER_DELETED' | 'PASSWORD_RECOVERY';

export interface Unsubscribe {
  unsubscribe(): void
}

export type AuthProvider = 'github' | 'google' | 'facebook' | 'discord' | 'twitter';

export type AuthOptions = {
  redirectTo?: string
  scopes?: string
}

export type AuthSession = {
  access_token: string
  expires_in?: number
  expires_at?: number
  refresh_token?: string
}

export interface IDatastore<U, S> {
  signinWithEmail(email: string, password?: string): Promise<U | null>;
  signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<S | null>;
  signout(): Promise<void>;
  onAuthStateChanged(callback: (event: AuthEvent, data: any) => void): Unsubscribe;
}
