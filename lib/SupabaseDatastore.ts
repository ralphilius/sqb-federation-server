import { AuthEvent, IDatastore, AuthProvider, AuthSession, Unsubscribe, AuthOptions } from "./IDatastore";
import { createClient, SupabaseClient, Session, Subscription } from '@supabase/supabase-js'

export class SupabaseDatastore extends IDatastore {

  public onAuthStateChanged(callback: (event: AuthEvent, data: any) => void): Unsubscribe {
    if (!this.client) throw "Please call initialize() before using any method";

    const stateChange = this.client?.auth.onAuthStateChange(async (event, session) => {
      callback(event, session);
    });

    const session = this.client.auth.session();
    if(session?.user) callback('SIGNED_IN', session);

    if (!stateChange || !stateChange.data) return { unsubscribe: () => { } }

    return stateChange.data;
  }

  private client: SupabaseClient | null = null;
  private constructor() {
    super();
  }

  public static initialize(): SupabaseDatastore {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined")

    const ds = new SupabaseDatastore();
    ds.client = createClient(
      supabaseUrl,
      supabaseAnonKey
    )
    return ds;
  }

  public signinWithProvider(provider: AuthProvider, options?: AuthOptions): Promise<AuthSession | null> {
    if (!this.client) throw "Please call initialize() before using any method";

    return this.client.auth.signIn({ provider: provider }, options).then(val => val.session)
  }

  public async signout(): Promise<void> {
    if (!this.client) throw "Please call initialize() before using any method";

    return this.client.auth.signOut().then(error => {
      console.log(error);
      return;
    })
  }

}