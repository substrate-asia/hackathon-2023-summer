import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
// import Spotlight from './CopyInvesting/Spotlight'
import CopyInvestingFundList from './CopyInvesting/CopyInvestingFundList'

const CopyInvesting = () => {
  const [selectTabsKey, setSelectTabsKey] = useState<string>('1')
  const onChange = (key: string) => {
    setSelectTabsKey(key)
  }

  const items: TabsProps['items'] = [
    // {
    //   key: '1',
    //   label: `In The Spotlight`,
    //   children: <Spotlight />,
    // },
    {
      key: '1',
      label: `Copy-Investing Funds`,
      children: <CopyInvestingFundList selectTabsKey={selectTabsKey} />,
    },
  ]

  return (
    <div>
      <Tabs
        style={{ width: '100%' }}
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </div>
  )
}

export default CopyInvesting
