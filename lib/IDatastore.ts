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

export abstract class IDatastore{
  public static initialize(): IDatastore{
    throw "This method needs to be implemented"  //Throw this until https://github.com/microsoft/TypeScript/issues/34516 got implemented
  };
  public abstract signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<AuthSession | null>;
  public abstract signout(): Promise<void>;
  public abstract onAuthStateChanged(callback: (event: AuthEvent, data: any) => void): Unsubscribe;
}
