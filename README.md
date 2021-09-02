# Stellar Federation Server
NextJS implementation for Federation Server as described in [stellar-quest-bounties](https://github.com/tyvdh/stellar-quest-bounties/blob/main/bounties/level-2/federation-server.md)


Register Supabase account
--------

You need to register a [Supabase](https://supabase.io) account and acquire below credentials in project Settings:
 
 - Server URL
 - Anon Key
 - Service Key

Set up database schema
--------
Open the SQL in Supabase project dashboard then run the script in `schema.sql` to set up tables, functions and triggers

Set up environment variables
--------

```bash
npm run setup
# or
yarn setup 
```
Enter the credentials as instructed in the CLI.


Run the development server
--------

```bash
npm run dev
# or
yarn dev
```

Test the implementation
--------

API is available under `/api/federation` endpoint. Supported queries:

 - `q`: Federation address to query for Stellar address
 - `type`: Only `name` is supported now