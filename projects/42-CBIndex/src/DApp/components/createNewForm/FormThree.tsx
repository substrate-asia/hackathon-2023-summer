import React, { useMemo, useState, useEffect } from 'react'
import { Input, Switch, Tag, InputNumber, Select } from 'antd'
import { animated, useTransition } from 'react-spring'
const entranceSlect = [
  { value: 'vault', label: 'vault' },
  { value: 'Manager or other recipient', label: 'Mmnager' },
]
const managementFeeErrorText = (
  <div
    style={{
      color: 'red',
    }}
  >
    The ratio must be between 0% and 100%.
  </div>
)
const initTransition = (variable: boolean) => {
  return useTransition(variable, {
    from: { height: '1px', opacity: 0 },
    leave: { height: '1px', opacity: 0.5 },
    enter: { height: 'auto', opacity: 1 },
    config: { duration: 500 },
    unique: true,
    reset: true, // 添加 reset 属性
    reverse: !variable, // 添加 reverse 属性
  })
}
const FormThree = (props: any) => {
  const {
    getTreeFee,
    myPerformanceFee,
    myManagementFee,
    myEntranceFee,
    myPendingExitFee,
    myKindExitFee,
    getTreeSwtichStatus,
    myManagementFeeSwitch,
    myPerformanceFeeSwitch,
    myEntranceFeeSwitch,
    myExitFeeSwitch,
  } = props
  const [managementFeeSwitch, setManagementFeeSwitch] = useState(false)
  const [performanceFeeSwitch, setPerformanceFeeSwitch] = useState(false)
  const [entranceFeeSwitch, setEntranceFeeSwitch] = useState(false)
  const [exitFeeSwitch, setExitFeeSwitch] = useState(false)
  const [managementFee, setManagementFee] = useState(0)
  const [managementFeeError, setManagementFeeError] = useState(false)
  const [performanceFee, setPerformanceFee] = useState(0)
  const [performanceError, setPerformanceError] = useState(false)
  const [entranceFee, setEntranceFee] = useState(0)
  const [entranceFeeError, setEntranceFeeError] = useState(false)
  const [kindExitFee, setKindExitFee] = useState(0)
  const [kindExitFeeError, setKindExitFeeError] = useState(false)
  const [pendingExitFee, setPendingExitFee] = useState(0)
  const [pendingExitFeeError, setPendingExitFeeError] = useState(false)
  const managementSwitchEvt = (va: boolean) => {
    setManagementFeeSwitch(va)
  }
  const performanceSwitchEvt = (va: boolean) => {
    setPerformanceFeeSwitch(va)
  }
  const entranceSwitchEvt = (va: boolean) => {
    setEntranceFeeSwitch(va)
  }
  const exitSwitchEvt = (va: boolean) => {
    setExitFeeSwitch(va)
  }
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  const managementFeeChangeEvt = (value: any) => {
    setManagementFee(value)
    if (value === 0) {
      setManagementFeeError(true)
      return
    }
    if (value < 100) {
      setManagementFeeError(false)
    } else {
      setManagementFeeError(true)
    }
  }
  const performanceFeeChangeEvt = (value: any) => {
    setPerformanceFee(value)
    if (value === 0) {
      setPerformanceError(true)
      return
    }
    if (value < 100) {
      setPerformanceError(false)
    } else {
      setPerformanceError(true)
    }
  }
  const entranceFeeChangeEvt = (value: any) => {
    setEntranceFee(value)
    if (value === 0) {
      setEntranceFeeError(true)
      return
    }
    if (value < 100) {
      setEntranceFeeError(false)
    } else {
      setEntranceFeeError(true)
    }
  }
  const kindExitFeeChangeEvt = (value: any) => {
    setKindExitFee(value)
    if (value === 0) {
      setKindExitFeeError(true)
      return
    }
    if (value < 100) {
      setKindExitFeeError(false)
    } else {
      setKindExitFeeError(true)
    }
  }
  const pendingExitFeeChangeEvt = (value: any) => {
    setPendingExitFee(value)
    if (value === 0) {
      setPendingExitFeeError(true)
      return
    }
    if (value < 100) {
      setPendingExitFeeError(false)
    } else {
      setPendingExitFeeError(true)
    }
  }
  useEffect(
    function () {
      getTreeFee(
        managementFee,
        performanceFee,
        entranceFee,
        kindExitFee,
        pendingExitFee
      )
    },
    [managementFee, performanceFee, entranceFee, kindExitFee, pendingExitFee]
  )
  useEffect(
    function () {
      getTreeSwtichStatus(
        managementFeeSwitch,
        performanceFeeSwitch,
        entranceFeeSwitch,
        exitFeeSwitch
      )
    },
    [
      managementFeeSwitch,
      performanceFeeSwitch,
      entranceFeeSwitch,
      exitFeeSwitch,
    ]
  )
  useEffect(function () {
    setManagementFee(myManagementFee)
    setPerformanceFee(myPerformanceFee)
    setEntranceFee(myEntranceFee)
    setKindExitFee(myKindExitFee)
    setPendingExitFee(myPendingExitFee)
    setManagementFeeSwitch(myManagementFeeSwitch)
    setPerformanceFeeSwitch(myPerformanceFeeSwitch)
    setEntranceFeeSwitch(myEntranceFeeSwitch)
    setExitFeeSwitch(myExitFeeSwitch)
  }, [])
  return (
    <div className="text-white">
      <div className="text-2xl font-medium text-white">Fees</div>
      <div className="text-sm  text-zinc-400">
        Vault managers can charge several types of fees, all of which are paid
        out in shares of the vault. To enable a fee, toggle it on and configure
        it below.
      </div>
      {/* 管理费 */}
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Charge Management Fee
            </div>
            <Switch
              checked={managementFeeSwitch}
              onChange={managementSwitchEvt}
            />
          </div>
          <div className="font-normal">
            If enabled, a flat fee measured as an annual percent of total assets
            under management. The management fee accrues continuously and is
            automatically paid out with every deposit and redemption. The fee
            recipient is the vault manager by default, or any other wallet. If
            you wish to split fee amounts among several wallets, please contact
            our sales team at support@avantgarde.finance. For an in-depth
            description of how this fee is calculated, please refer to the User
            Documentation.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {managementFeeSwitch ? (
            <div className="font-normal">
              <div>Management Fee Rate</div>
              <InputNumber
                status={
                  managementFeeError || !managementFee ? 'error' : undefined
                }
                placeholder="0"
                value={managementFee}
                max={100}
                min={0}
                onChange={managementFeeChangeEvt}
                addonAfter={'%'}
              />
              {managementFeeError && managementFeeErrorText}
              <div>
                Recipient Address (optional) By default, the fee recipient is
                the vault owner
              </div>
              <Input />
            </div>
          ) : null}
        </div>
      </section>
      {/* 收取绩效费 */}
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Charge Performance Fee
            </div>
            <Switch
              checked={performanceFeeSwitch}
              onChange={performanceSwitchEvt}
            />
          </div>
          <div className="font-normal">
            If enabled, measured based on the vault's performance. The
            performance fee is subject to a high-water mark. The fee recipient
            is the vault manager by default, or any other wallet. If you wish to
            split fee amounts among several wallets, please contact our sales
            team at support@avantgarde.finance. For an in-depth description of
            how this fee is calculated, please refer to the User Documentation.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {performanceFeeSwitch && (
            <div className="font-normal">
              <div>Performance Fee Rate</div>
              <InputNumber
                max={100}
                min={0}
                value={performanceFee}
                onChange={performanceFeeChangeEvt}
                status={
                  performanceError || !performanceFee ? 'error' : undefined
                }
                addonAfter={'%'}
              />
              {performanceError && managementFeeErrorText}
              <div>
                Recipient Address (optional) By default, the fee recipient is
                the vault owner
              </div>
              <Input />
            </div>
          )}
        </div>
      </section>
      {/* 收取入场费 */}
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Charge Entrance Fee
            </div>
            <Switch checked={entranceFeeSwitch} onChange={entranceSwitchEvt} />
          </div>
          <div className="font-normal">
            If enabled, entrance fees are charged with every new deposit.
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>
          {entranceFeeSwitch && (
            <div className="font-normal">
              <div>Entrance Fee allocated to</div>
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChange}
                options={entranceSlect}
              />
              <div>
                <div>Entrance Fee Rate</div>
                <InputNumber
                  status={
                    entranceFeeError || !entranceFee ? 'error' : undefined
                  }
                  value={entranceFee}
                  max={100}
                  min={0}
                  addonAfter={'%'}
                  onChange={entranceFeeChangeEvt}
                />
                {entranceFeeError && managementFeeErrorText}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* 收取退出费 */}
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4 px-4 py-5 sm:p-6">
          <div className="flex justify-between">
            <div className="text-2xl font-medium text-white">
              Charge Exit Fee
            </div>
            <Switch checked={exitFeeSwitch} onChange={exitSwitchEvt} />
          </div>
          <div className="font-normal">
            If enabled, exit fees are charged with every redemption. This fee is
            set separately for in-kind redemptions (when a user redeems their
            shares for all the assets held by the vault) or for specific asset
            redemptions (when a user redeems their shares for one or a few of
            the tokens held by the vault).
          </div>
          <div>
            <Tag color="warning">Semi-permanent Setting</Tag>
          </div>

          {exitFeeSwitch && (
            <>
              <div className="font-normal">
                <div>Exit Fee allocated to</div>
                <Select
                  defaultValue="lucy"
                  style={{ width: 120 }}
                  onChange={handleChange}
                  options={entranceSlect}
                />
              </div>
              <div>
                <div>Exit Fee Rate for in kind redemptions</div>
                <InputNumber
                  max={100}
                  min={0}
                  value={kindExitFee}
                  status={
                    kindExitFeeError || !kindExitFee ? 'error' : undefined
                  }
                  onChange={kindExitFeeChangeEvt}
                />
                {kindExitFeeError && managementFeeErrorText}
              </div>
              <div>
                <div>Exit Fee Rate for redemptions in specific assets</div>
                <InputNumber
                  max={100}
                  min={0}
                  value={pendingExitFee}
                  status={
                    pendingExitFeeError || !pendingExitFee ? 'error' : undefined
                  }
                  addonAfter={'%'}
                  onChange={pendingExitFeeChangeEvt}
                />
                {pendingExitFeeError && managementFeeErrorText}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default FormThree
