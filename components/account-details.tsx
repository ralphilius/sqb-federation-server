import { useAddress } from '../hooks/use-store';
import { AuthUser } from '../lib/IAuth';
import albedo from '@albedo-link/intent'
import { verifyMessageSignature } from '@albedo-link/signature-verification'
import { useEffect, useState } from 'react';
import fetcher from '../lib/fetcher';
import { useAuth } from '../hooks/use-auth';

type AccountDetailRowSpec = {
  label: string
  value?: string
  actionLabel?: string
  onAction?: () => void
}

const AccountDetailRow: React.FC<AccountDetailRowSpec> = ({ children, label, value, actionLabel, onAction }) => {
  return (
    <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {!children && <span className="flex-grow">{value}</span>}
        {children}
      </dd>
    </div>
  )
}

const RowButton = ({ children, ...remaining }) => (<button
  type="button"
  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  {...remaining}
>
  {children}
</button>)

type AccountDetailsSpec = {
  user: AuthUser
  stellarAddress?: string
  federationAddress?: string
}

const AccountDetails: React.FC<AccountDetailsSpec> = ({ user }) => {
  const { signout } = useAuth();
  const { address, saveAddress, saveUsername } = useAddress(user.id);
  const [editingFederation, setEditingFederation] = useState(false);
  const currentAddress = address ? `${address['username']}*${process.env.NEXT_PUBLIC_FEDERATION_DOMAIN}` : "";
  const [username, onChanged] = useState(address?.['username'] || "");

  useEffect(() => {
    onChanged(address?.['username'] || "");
  }, [address])

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
                  albedo.publicKey({ token: random.toString() }).then(async (res) => {
                    if (verifyMessageSignature(res.pubkey, random.toString(), res.signature)) {
                      await saveAddress(user.id, res.pubkey);
                    }
                  })
                }}
              >
                Sign in with Albedo
              </button>}
          </AccountDetailRow>
          <AccountDetailRow
            label="Federation address" value={address ? currentAddress : ""}
            actionLabel="Edit federation"
          >
            {!editingFederation && <span className="flex-grow">{currentAddress}</span>}
            {editingFederation &&
              <div className="flex flex-grow rounded-md shadow-sm justify-center -mt-2 -ml-2">
                <input
                  type="text"
                  className="flex-grow items-center px-3 rounded-l-md border border-r-0 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => onChanged(e.target.value)}
                  value={username}
                />
                <span className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-50 text-gray-500 sm:text-sm border border-gray-300">
                  *{currentAddress.split("*")[1]}
                </span>
              </div>
            }
            <span className="ml-4 flex-shrink-0 justify-center">
              <RowButton
                onClick={async () => {
                  if (editingFederation && username != address?.['username']) {
                    await saveUsername(user.id, username);
                  }
                  setEditingFederation(!editingFederation)
                }}
              >
                Edit federation
              </RowButton>
            </span>
          </AccountDetailRow>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt
              className="text-sm font-light text-red-500 cursor-pointer"
              onClick={() => {
                fetcher("/api/me", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ uid: user.id })
                }).then(() => {
                  signout();
                })
              }}
            >
              Delete account
            </dt>
          </div>
        </dl>
      </div>
    </>
  )
}

export default AccountDetails;