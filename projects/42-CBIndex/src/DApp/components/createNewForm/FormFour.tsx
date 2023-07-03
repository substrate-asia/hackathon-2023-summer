import React, { useEffect, useState } from 'react'
import { Switch, Tag, Input, InputNumber } from 'antd'
import WarnText from './WarnText'
const minErrorText = (
  <div style={{ color: 'red' }}>
    Minimum deposit amount cannot be zero. Disable the switch instead.
  </div>
)
const minIntervalErrorText = (
  <div style={{ color: 'red' }}>
    The minimum deposit amount must be less than the maximum deposit amount.
  </div>
)
const maxIntervalErrorText = (
  <div style={{ color: 'red' }}>
    The maximum deposit amount must be greater than the minimum deposit amount.
  </div>
)
const FormFour = () => {
  const [depositSwitch, setDepositSwitch] = useState(false)
  const [selected, setSelected] = useState(0)
  const [depositLimitSwtich, setDepositLimitSwtich] = useState(false)
  const [depositLimitMin, setDepositLimitMin] = useState(0)
  const [depositLimitMax, setDepositLimitMax] = useState(0)
  const [depositLimitMinSwitch, setDepositLimitMinSwitch] = useState(false)
  const [depositLimitMaxSwitch, setDepositLimitMaxSwitch] = useState(false)
  const [depositLimitMinError, setDepositLimitMinError] = useState(false)
  const [depositLimitMaxError, setDepositLimitMaxError] = useState(false)
  const [depositLimitMinIntervalError, setDepositLimitMinIntervalError] =
    useState(false)
  const [deposilLimitMaxIntervalError, setDeposilLimitMaxIntervalError] =
    useState(false)
  const handleSelect = (id: number) => {
    setSelected(id)
  }
  const depositSwitchEvt = (va: boolean) => {
    setDepositSwitch(va)
  }
  const depositLimitSwtichEvt = (va: boolean) => {
    setDepositLimitSwtich(va)
  }
  const depositLimitMaxEvt = (va: any) => {
    setDepositLimitMax(va)
    if (va === 0) {
      setDepositLimitMaxError(true)
    } else {
      setDepositLimitMaxError(false)
    }
  }
  const depositLimitMinEvt = (va: any) => {
    setDepositLimitMin(va)
    if (va === 0) {
      setDepositLimitMinError(true)
    } else {
      setDepositLimitMinError(false)
    }
  }
  const depositLimitMaxSwitchEvt = (va: boolean) => {
    setDepositLimitMaxSwitch(va)
  }
  const depositLimitMinSwitchEvt = (va: boolean) => {
    setDepositLimitMinSwitch(va)
  }
  useEffect(
    function () {
      if (depositLimitMax < depositLimitMin) {
        setDeposilLimitMaxIntervalError(true)
      }
      if (depositLimitMin > depositLimitMax) {
        setDepositLimitMinIntervalError(true)
      }
      if (depositLimitMax > depositLimitMin) {
        setDeposilLimitMaxIntervalError(false)
        setDepositLimitMinIntervalError(false)
      }
    },
    [depositLimitMin, depositLimitMax]
  )
  return (
    <div>
      <div className="font-medium text-white">Deposits</div>
      <WarnText>
        本节中的设置是有限制的。让他们能够控制谁可以存入您的金库，以及存入的金额。如果禁用，任何人都可以将任何金额存入您的金库。
      </WarnText>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit Wallets Permitted To Deposit
            </div>
            <Switch onChange={depositSwitchEvt} />
          </div>
          <div className="font-normal">
            If enabled, exit fees are charged with every redemption. This fee is
            set separately for in-kind redemptions (when a user redeems their
            shares for all the assets held by the vault) or for specific asset
            redemptions (when a user redeems their shares for one or a few of
            the tokens held by the vault).
          </div>
          <div>
            <Tag color="green">Editable Setting</Tag>
          </div>
          {depositSwitch && (
            <div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(1)}
                className={`mb-2 h-5 w-1/2 cursor-pointer rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  selected === 1 && 'border-green-800'
                }`}
              >
                Specify deposit limits
                {selected === 1 && <Input />}
              </div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(2)}
                className={`flex w-1/2  cursor-pointer flex-col rounded-xl border-2 border-green-500 text-white hover:border hover:border-green-800 ${
                  selected === 2 && 'border-green-800'
                }`}
              >
                <span>Reject all deposits</span>
                <span className="text-zinc-400">
                  If you choose to reject all deposits, no one (including
                  yourself) will be able to invest in the vault. This setting
                  can be changed later.
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
              Deposit Limits
            </div>
            <Switch onChange={depositLimitSwtichEvt} />
          </div>
          <div className="font-normal">
            Restricts the amount of a single deposit with either a minimum, a
            maximum, or both. You can also reject all deposits into this vault
            using this policy.
          </div>
          <div>
            <Tag color="green">Editable Setting</Tag>
          </div>
          {depositLimitSwtich && (
            <div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(1)}
                className={`mb-2 h-5 w-1/2 cursor-pointer rounded-xl border border-zinc-900 text-white hover:border-2 hover:border-green-800 ${
                  selected === 1 && 'border-green-900'
                }`}
              >
                Limit Wallets Permitted To Deposit
                {selected === 1 && (
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="flex flex-col-reverse">
                        <Switch onChange={depositLimitMinSwitchEvt} />
                      </div>
                      <div>
                        <div>Minimum Deposit Amount</div>
                        <div>
                          <InputNumber
                            min={0}
                            addonAfter="DAI"
                            value={depositLimitMin}
                            onChange={depositLimitMinEvt}
                          />
                        </div>
                      </div>
                    </div>
                    {!depositLimitMaxSwitch
                      ? null
                      : !depositLimitMinSwitch
                      ? null
                      : depositLimitMinError
                      ? minErrorText
                      : depositLimitMinIntervalError
                      ? minIntervalErrorText
                      : null}
                    <div className="flex">
                      <div className="flex flex-col-reverse">
                        <Switch onChange={depositLimitMaxSwitchEvt} />
                      </div>
                      <div>
                        <div>Maximum Deposit Amount</div>
                        <div>
                          <InputNumber
                            min={0}
                            value={depositLimitMax}
                            addonAfter="DAI"
                            onChange={depositLimitMaxEvt}
                          />
                        </div>
                      </div>
                    </div>
                    {!depositLimitMinSwitch
                      ? null
                      : !depositLimitMaxSwitch
                      ? null
                      : depositLimitMaxError
                      ? minErrorText
                      : deposilLimitMaxIntervalError
                      ? maxIntervalErrorText
                      : null}
                  </div>
                )}
              </div>
              <div
                style={{ height: '100%', padding: '10px 10px 10px 10px' }}
                onClick={() => handleSelect(2)}
                className={`flex w-1/2  cursor-pointer flex-col rounded-xl border border-zinc-900 text-white hover:border-2  hover:border-green-800 ${
                  selected === 2 && 'border-green-900'
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
export default FormFour
