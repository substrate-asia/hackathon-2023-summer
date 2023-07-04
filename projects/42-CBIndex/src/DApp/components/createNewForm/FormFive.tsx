import React, { useState } from 'react'
import { Switch, Tag, Input } from 'antd'
import WarnText from './WarnText'
const FormFive = () => {
  const [limitationTransferenceSwitch, setLimitationTransferenceSwitch] =
    useState(false)
  const [selected, setSelected] = useState(0)
  const limitationTransferenceSwitchEvt = (va: boolean) => {
    setLimitationTransferenceSwitch(va)
  }
  const handleSelect = (id: number) => {
    setSelected(id)
  }
  return (
    <div>
      <div className="font-medium text-white">Shares Transferability</div>
      <WarnText>
        Settings in this section are restrictive. Enable them to determine who
        can receive your vault's shares via direct transfer. If disabled, anyone
        can receive your vault's shares in the secondary market.
      </WarnText>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Restrict Wallets Permitted To Receive A Share Transfer
            </div>
            <Switch onChange={limitationTransferenceSwitchEvt} />
          </div>
          <div className="font-normal">
            If enabled, restricts the potential recipients of shares transferred
            outside of the normal asset deposit and share minting process. This
            policy acts in concert with but not as a replacement for the policy
            which restricts wallets able to receive minted shares. In general,
            if you enable this policy to restrict who can receive shares that
            are already minted, you should also restrict who can mint new shares
            to the same list of wallets.
          </div>
          <div>
            <Tag color="green">Editable Setting</Tag>
          </div>
          {limitationTransferenceSwitch && (
            <div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(1)}
                className={`mb-2 h-5 w-1/2 cursor-pointer rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  selected === 1 && 'border-green-800'
                }`}
              >
                Limit Wallets Permitted To Deposit
                {selected === 1 && <Input />}
              </div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(2)}
                className={`flex w-1/2  cursor-pointer flex-col rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  selected === 2 && 'border-green-800'
                }`}
              >
                <span>Disallow all depositor addresses</span>
                <span className="text-zinc-400">
                  This setting can be changed later
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
export default FormFive
