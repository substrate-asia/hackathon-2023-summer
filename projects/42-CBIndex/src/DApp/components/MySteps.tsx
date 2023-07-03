import React from 'react'
import { Steps } from 'antd'
const stepArry = [
  {
    title: 'Before you start',
  },
  {
    title: 'Basics',
  },
  {
    title: 'Fees',
  },
  {
    title: 'Deposits',
  },
  {
    title: 'Shares transferability',
  },
  {
    title: 'Redemptions',
  },
  {
    title: 'Asset management',
  },
  {
    title: 'Review',
  },
]
const MySteps = ({ current }: { current: number }) => (
  <Steps direction="vertical" current={current} items={stepArry} />
)

export default MySteps
