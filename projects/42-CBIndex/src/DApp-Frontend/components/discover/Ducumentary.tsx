import React, { useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import Spotlight from './DucumentaryTabs/Spotlight'
import PortfolioList from './DucumentaryTabs/PortfolioList'
const Documentary = () => {
  const [selectTabsKey, setSelectTabsKey] = useState<string>('1')
  const onChange = (key: string) => {
    setSelectTabsKey(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `In The Spotlight`,
      children: <Spotlight />,
    },
    {
      key: '2',
      label: `Portfolio List`,
      children: <PortfolioList selectTabsKey={selectTabsKey} />,
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

export default Documentary
