import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../hooks/use-auth'

const AuthLogout = () => {
  console.log("AuthLogout");
  const { signout } = useAuth()
  const router = useRouter()
  useEffect(() => {
    signout().then(() => router.replace('/auth'))
  }, [])

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-green-900 to-teal-900 text-white">
      <div className="flex flex-col items-center space-y-2">
        <svg
          className="animate-spin h-8 w-8 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-lg font-medium">We&lsquo;re logging you out</span>
      </div>
    </div>
  )
}

export default AuthLogout