import { AuthEvent, AuthProvider, Unsubscribe, AuthOptions, IAuth, AuthSession } from "./IAuth";
import { SupabaseClient, Session, User } from '@supabase/supabase-js'
import { initSupabase } from "./supabase";
import { IDatastore } from "./IDatastore";

export class SupabaseDatastore implements IAuth<User, AuthSession>, IDatastore {
  private client: SupabaseClient;

  constructor() {
    this.client = initSupabase();
  }

  async signinWithEmail(email: string, password?: string): Promise<User | null> {
    return this.client.auth.signIn({ email, password}).then(res => res.user)
  }

  async signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<AuthSession | null> {
    const val = await this.client.auth.signIn({ provider: provider }, options);
    return val.session;
  }


  public async signout(): Promise<void> {
    return this.client.auth.signOut().then(error => {
      console.log(error);
      return;
    })
  }

  public onAuthStateChanged(callback: (event: AuthEvent, data: any) => void): Unsubscribe {
    const stateChange = this.client?.auth.onAuthStateChange(async (event, session) => {
      callback(event, session);
    });

    const session = this.client.auth.session();
    if (session?.user) callback('SIGNED_IN', session);

    if (!stateChange || !stateChange.data) return { unsubscribe: () => { } }

    return stateChange.data;
  }

  public getClient(){
    return this.client;
  }

}