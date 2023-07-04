import React, { useEffect } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}
function formatString(input: string) {
  if (input.length <= 6) {
    return input
  }
  const front = input.slice(0, 5)
  const back = input.slice(-5)
  return `${front}...${back}`
}
const StatisticalData = (props: any) => {
  const { followersList } = props
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <a>{formatString(text)}</a>,
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
  ]
  return (
    <>
      <Table columns={columns} dataSource={followersList} />
    </>
  )
}
export default StatisticalData
