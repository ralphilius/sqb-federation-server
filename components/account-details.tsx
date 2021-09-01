import { useAddress } from '../hooks/use-store';
import { AuthUser } from '../lib/IAuth';
import albedo from '@albedo-link/intent'
import {verifyMessageSignature} from '@albedo-link/signature-verification'

type AccountDetailRowSpec = {
  label: string
  value?: string
  actionLabel?: string
  onAction?: () => void
}

const AccountDetailRow: React.FC<AccountDetailRowSpec> = ({ children, label, value, actionLabel, onAction }) => (
  <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {!children && <>
        <span className="flex-grow">{value}</span>
        <span className="ml-4 flex-shrink-0">
          <button
            type="button"
            className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {actionLabel}
          </button>
        </span>
      </>}
      {children}
    </dd>
  </div>
)

type AccountDetailsSpec = {
  user: AuthUser
  stellarAddress?: string
  federationAddress?: string
}

const AccountDetails: React.FC<AccountDetailsSpec> = ({ user }) => {
  const { address, saveAddress } = useAddress(user.id);
  console.log(address)
  return (
    <>
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and Stellar address details.</p>
      </div>
      <div className="mt-5 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          <AccountDetailRow label="Email address" value={user.email || ""} />
          <AccountDetailRow label="Stellar address" value={address?.['address'] || ""}>
            {!address?.address &&
              <button
                className="rounded border border-blue-400 p-1 px-2"
                onClick={(e) => {
                  const random = Math.floor(Math.random() * 1000000000) + 1
                  albedo.publicKey({token: random.toString()}).then(async (res) => {
                    if(verifyMessageSignature(res.pubkey, random.toString(), res.signature)){
                      await saveAddress(user.id, res.pubkey);
                    }
                  })
                }}
              >
                Sign in with Albedo
              </button>}
          </AccountDetailRow>
          <AccountDetailRow label="Federation address" value={address ? `${address?.['username']}*ralphilius.github.io` : ""} />
        </dl>
      </div>
    </>
  )
}

export default AccountDetails;