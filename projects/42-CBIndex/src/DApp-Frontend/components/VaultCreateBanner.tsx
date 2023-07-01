import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
const VaultCreateBanner = () => {
  const router = useRouter()
  return (
    <>
      <div className="flex h-60 items-center justify-center text-slate-50">
        <div className="flex h-full items-center justify-center">
          <Image src="/images/ozb1eycfl7.png" width={200} height={200} />
        </div>
        <div className="w-72 p-5">
          <h2 style={{ fontSize: '26px' }} className="font-medium">
            <span>Ready To Create </span>
            <span
              style={{
                // padding: '8px',
                // background:
                //   'radial-gradient(circle at center, #00FF00, rgba(0, 0, 0, 0.2))',
                // border: 'none',
                // backgroundClip: 'text',
                // color: '#00FF00',
              }}
            >
              Your Vault?
            </span>
          </h2>
          <h1 style={{ color: 'rgba(255, 255, 255, 0.51)' }}>
            Create your vault with one of the templates below. Templates are
            pre-filled but completely editable.
          </h1>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-gray-200 p-4 rounded-lg">
          <h3 className="mb-4 text-center text-slate-50">Public Vault</h3>
          <div
            style={{ color: 'rgb(255 255 255 / 51%)' }}
            className="flex h-full flex-col items-start rounded-lg  p-4 "
          >
            <h4 className="text-left">
              <span className="mr-2 text-green-1000">✓</span>Anyone can deposit
            </h4>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              No prior relationship required between you and your depositors
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Settings prioritise depositor protection over access to DeFi
              features
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Example: A Yearn- or Ribbon-like strategy
            </p>
          </div>
          <h3 className="mb-4 text-slate-50">
            <button
              onClick={() => router.push('/vault/create/new')}
              className="mt-4 w-full rounded-md bg-cyan-400 px-4 py-4 text-white hover:bg-cyan-950"
            >
              Create
            </button>
          </h3>
        </div>
        <div className="bg-gray-200 p-4">
          <h3 className="mb-4 text-center text-slate-50">Hybrid Vault</h3>
          <div
            style={{ color: 'rgb(255 255 255 / 51%)' }}
            className="flex h-full flex-col items-start rounded-lg  p-4"
          >
            <h4 className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              You can choose to approve depositors or not
            </h4>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              You are known by your depositors but not necessarily vice versa
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Settings protect you from malicious depositors
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Example: An investment club or a DeFi fund strategy run by a
              trusted manager
            </p>
          </div>
          <h3 className="mb-4 text-slate-50">
            <button
              onClick={() => router.push('/vault/create/new')}
              className="mt-4 w-full rounded-md bg-cyan-400 px-4 py-4 text-white hover:bg-cyan-950"
            >
              Create
            </button>
          </h3>
        </div>
        <div className="bg-gray-200 p-4">
          <h3 className="mb-4 text-center text-slate-50">Private Vault</h3>
          <div
            style={{ color: 'rgb(255 255 255 / 51%)' }}
            className="flex h-full flex-col items-start rounded-lg  p-4"
          >
            <h4 className="text-left">
              <span className="mr-2 text-green-1000">✓</span>You approve all
              depositors
            </h4>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              You know your depositors and vice versa, or you are the only
              depositor
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Settings prioritise access to DeFi features
            </p>
            <p className="text-left">
              <span className="mr-2 text-green-1000">✓</span>
              Example: DAOs managing their treasury, personal vaults, or vaults
              with legally binding contracts
            </p>
          </div>
          <h3 className="mb-4 text-slate-50">
            <button
              onClick={() => router.push('/vault/create/new')}
              className="mt-4 w-full rounded-md bg-cyan-400 px-4 py-4 text-white hover:bg-cyan-950"
            >
              Create
            </button>
          </h3>
        </div>
      </div>
      <div
        style={{ border: '2px solid #333', borderRadius: '10px' }}
        className="mb-3 mt-60"
      >
        <table className=" w-full table-auto rounded-md text-slate-50">
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th className="bg-gray-200 px-4 py-4 text-left"></th>
              <th className="bg-gray-200  px-4 py-4 text-left">Public Vault</th>
              <th className="bg-gray-200  px-4 py-4 text-left">Hybrid Vault</th>
              <th className="bg-gray-200 px-4 py-4 text-left">Private Vault</th>
            </tr>
          </thead>
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              >
                Fees
              </th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td
                style={{
                  color: 'rgb(156,163,175)',
                }}
                className="px-4 py-4"
              >
                Management Fee
              </td>
              <td className="px-4 py-4">1.0%</td>
              <td className="px-4 py-4">1.0%</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Performance Fee
              </td>
              <td className="px-4 py-4">10.0%</td>
              <td className="px-4 py-4">10.0%</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Entrance Fee
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Exit Fee
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span>In kind 0.0 %</span>
                  <span>Specific assets 1.0 %</span>
                  <span>Paid to the vault</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col">
                  <span>In kind 0.0 %</span>
                  <span>Specific assets 1.0 %</span>
                  <span>Paid to the vault</span>
                </div>
              </td>
              <td className="px-4 py-4">—</td>
            </tr>
          </tbody>
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              >
                Deposit Restrictions
              </th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Limit Wallets Permitted To Deposit
              </td>
              <td className="px-4 py-4">Not recommended</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Deposit Limits
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
          </tbody>
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              >
                Shares Transferability Restrictions
              </th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4 ">
                Restrict Wallets Permitted To Receive A Share Transfer
              </td>
              <td className="px-4 py-4">Not recommended</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
            </tr>
          </tbody>
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              >
                Restrict Wallets Permitted To Receive A Share Transfer
              </th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Restrict Assets For Redemption
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Specific Asset Redemption Threshold
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Shares Lock-Up Period
              </td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
              <td className="px-4 py-4">—</td>
            </tr>
          </tbody>
          <thead>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              >
                Asset Management Restrictions
              </th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
              <th
                className="bg-gray-200 bg-zinc-700 px-4 py-2 text-left"
                style={{ fontWeight: '500', fontSize: '17px' }}
              ></th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Limit Adapters To A Specified List
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Limit Allowed Adapters For Manager To A Specified List
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Limit External Positions To A Specified List
              </td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Limit External Positions To A Specified List
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Set Cumulative Slippage Tolerance
              </td>
              <td className="px-4 py-4">10.0%</td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr style={{ borderBottom: 'solid 0.5px rgb(63 63 70 / 42%)' }}>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Restrict External Position Removal
              </td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
            <tr>
              <td style={{ color: 'rgb(156,163,175)' }} className="px-4 py-4">
                Restrict Asset Position Removal
              </td>
              <td className="px-4 py-4">
                <span className="mr-2 text-green-1000">✓</span>
              </td>
              <td className="px-4 py-4">—</td>
              <td className="px-4 py-4">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default VaultCreateBanner
