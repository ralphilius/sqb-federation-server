import { AuthEvent, AuthProvider, Unsubscribe, AuthOptions, IDatastore } from "./IDatastore";
import { SupabaseClient, Session, User } from '@supabase/supabase-js'
import { initSupabase } from "./supabase";

export class SupabaseDatastore implements IDatastore<User, Session> {
  private client: SupabaseClient;

  constructor() {
    this.client = initSupabase();
  }

  async signinWithEmail(email: string, password?: string): Promise<User | null> {
    return this.client.auth.signIn({ email, password}).then(res => res.user)
  }

  async signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<Session | null> {
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

}