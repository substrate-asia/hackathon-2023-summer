import React, { useState } from 'react'
import WarnText from './WarnText'
import { Switch, Tag, Input } from 'antd'
const FormSeven = () => {
  const [assetManagementFeeSwitch, setAssetManagementFeeSwitch] =
    useState(false)
  return (
    <div>
      <div className="font-medium text-white">Asset Management</div>
      <WarnText>
        Settings in this section are restrictive. They allow you to control the
        ways in which your vault can interact with external DeFi protocols to
        manage its assets.
      </WarnText>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="green">Editable Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Limit External Positions To A Specified List
            </div>
            {/* <Switch onChange={limitationTransferenceSwitchEvt} /> */}
          </div>
          <div className="font-normal">
            Restricts the protocols with which a vault can interact using
            Enzyme's external position contract architecture. External positions
            are similar to adapters, and allow an Enzyme vault to interact with
            a new subset of DeFi protocols with different considerations. For
            more details on external positions, please see the Protocol
            Documentation. Currently borrowing on Compound is enabled by an
            external position.
          </div>
          <div>
            <Tag color="green">Editable Setting</Tag>
          </div>
          {/* {limitationTransferenceSwitch && (
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
          )} */}
        </div>
      </section>
    </div>
  )
}
export default FormSeven
