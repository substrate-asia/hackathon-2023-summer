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
const CurrentPositions = (props: any) => {
  const { assetsList } = props
  function formatString(input: string) {
    if (input.length <= 6) {
      return input
    }
    const front = input.slice(0, 4)
    const back = input.slice(-4)
    return `${front}...${back}`
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'address',
      key: 'address',
      render: (text) => <a>{formatString(text)}</a>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
  ]

  return (
    <>
      <Table columns={columns} dataSource={assetsList} />
    </>
  )
}
export default CurrentPositions
