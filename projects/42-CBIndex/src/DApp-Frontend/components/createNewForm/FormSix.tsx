import React, { useState } from 'react'
import { Switch, Tag, Input, InputNumber } from 'antd'
import WarnText from './WarnText'
const FormSix = () => {
  const [limitationRedemptionSwitch, setLimitationRedemptionSwitch] =
    useState(false)
  const [redemptionThresholdSwitch, setRedemptionThresholdSwitch] =
    useState(false)
  const [selected, setSelected] = useState(0)
  const [redemptionThresholdSelect, setRedemptionThresholdSelect] = useState(0)
  const limitationReaemptionSwitchEvt = (va: boolean) => {
    setLimitationRedemptionSwitch(va)
  }
  const redemptionThresholdSwitchEvt = (va: boolean) => {
    setRedemptionThresholdSwitch(va)
  }
  const handleSelect = (id: number) => {
    setSelected(id)
  }
  const redemptionThreseholdSelect = (id: number) => {
    setRedemptionThresholdSelect(id)
  }
  return (
    <div>
      <div className="font-medium text-white">Redemptions</div>
      <WarnText>
        Settings in this section are restrictive. Enable them to determine who
        can receive your vault's shares via direct transfer. If disabled, anyone
        can receive your vault's shares in the secondary market.
      </WarnText>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Shares Lock-Up Period
            </div>
          </div>
          <div className="font-normal">
            <h1>
              Defines the amount of time that must pass after a user’s last
              receipt of shares via deposit before that user is allowed to
              either redeem or transfer any shares. This is an arbitrage
              protection, and funds that have untrusted investors should use a
              non-zero value. The recommended value is 24 hours.
            </h1>
            <p>
              If you have enabled specific-asset redemption, you can protect
              your vault's balances of those assets from total depletion by
              configuring this policy.
            </p>
          </div>
          <div>
            <Tag color="yellow">Semi-permanent Setting</Tag>
          </div>
          <h1>Shares Lock-Up Period</h1>
          <InputNumber />
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Specific Asset Redemption Threshold
            </div>
            <Switch onChange={redemptionThresholdSwitchEvt} />
          </div>
          <div className="font-normal">
            <h1>
              Restricts the value of a specific-asset redemption by setting a
              minimum balance of that asset that the vault must maintain
              post-withdrawal. Specific-asset withdrawals that would reduce the
              vault's balance below this level will be rejected. Note that the
              depositor can still redeem their shares by withdrawing their pro
              rata share of the vault's holdings.
            </h1>
            <p>
              If you have enabled specific-asset redemption, you can protect
              your vault's balances of those assets from total depletion by
              configuring this policy.
            </p>
          </div>
          <div>
            <Tag color="yellow">Semi-permanent Setting</Tag>
          </div>
          {redemptionThresholdSwitch && (
            <div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => redemptionThreseholdSelect(1)}
                className={`mb-2 h-5 w-1/2 cursor-pointer rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  redemptionThresholdSelect === 1 && 'border-green-800'
                }`}
              >
                Limit Wallets Permitted To Deposit
                {redemptionThresholdSelect === 1 && <Input />}
              </div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => redemptionThreseholdSelect(2)}
                className={`flex w-1/2  cursor-pointer flex-col rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  redemptionThresholdSelect === 2 && 'border-green-800'
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
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Restrict Assets For Redemption
            </div>
            <Switch onChange={limitationReaemptionSwitchEvt} />
          </div>
          <div className="font-normal">
            <h1>
              Restricts the assets for which a depositor may redeem their vault
              shares. If this policy is not enabled, depositors may redeem their
              shares in-kind or in any arbitrary combination of assets held by
              your vault. There are two common implementations of this policy to
              control how your depositors can redeem their shares:
            </h1>
            <p>
              To limit depositors' redemption options to in-kind or
              specific-asset redemptions where you control which assets are
              available, toggle this policy on and add assets to the list. Note
              that if you use this implementation, your depositors can
              materially change the composition of your portfolio without
              notice. Implementing an accompanying Single Asset Redemption
              Threshold (below) can mitigate this risk.
            </p>
            <p>
              To limit depositors' redemption options to in-kind only, select
              'Only allow in-kind redemption'.
            </p>
          </div>
          <div>{/* <Tag color="green">Editable Setting</Tag> */}</div>
          {limitationRedemptionSwitch && (
            <div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(1)}
                className={`mb-2 h-5 w-1/2 cursor-pointer rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  selected === 1 && 'border-green-800'
                }`}
              >
                Limit Wallets Permitted To Deposit
                {redemptionThresholdSelect === 1 && <Input />}
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

export default FormSix
