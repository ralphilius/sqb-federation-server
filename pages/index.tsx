import { useAuth } from '../hooks/use-auth'
import AccountDetails from '../components/account-details'
import { useAddress } from '../hooks/use-store'
import HeadingMenu from '../components/menu';

// const user = {
//   name: 'Tom Cook',
//   email: 'tom@example.com',
//   imageUrl:
//     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
// }


const HomePage = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className="bg-gray-800 pb-32">
        <HeadingMenu user={user}/>
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Federation Account Service</h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            {user && <AccountDetails user={user} />}
          </div>

        </div>
      </main>
    </div>
  )
}

export default HomePage;