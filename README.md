# NextJS Hackathon Starter
A boilerplate for NextJS application with Typescript support

Getting Started
--------

First, set up environment variables:

```bash
npm run setup
# or
yarn setup 
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Features
--------

 - **Typescript** support
 - **envdist** to set up environment variables
 - Authentication with **Supabase** or **Firebase**
    - Email/password or passwordless with magic link
    - Multiple providers: Google, Facebook, Twitter, Github, Discord,...
 - **jotai** for primitive & flexible state management
 - **SWR** for data fetching
 - Useful React Hooks
   - `useAuth` for getting user information
   - `useInterval` for for timeout tasks
 - **await-to-js** for easier error handling with async functions
 - **TailwindCSS** for styling with utility-first classes
   - **@tailwindcss/forms**: Form reset for easier applying utility classes
   - **@tailwindcss/aspect-ratio**: Utilities to apply aspect ratio to elements
 - **NProgress** for page transition progress indicator
 - Custom 404, 403 pages
 - Multiple icons with **Heroicons**