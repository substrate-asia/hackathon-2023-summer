import React, { useEffect } from 'react'
import { Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
  detail: string
}
const TradeHistory = (props: any) => {
  const { TradeHistoryList } = props
  const columns: ColumnsType<DataType> = [
    {
      title: 'Type',
      dataIndex: 'operation',
      key: 'operation',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (row, it) => {
        // console.log(JSON.parse(atob(it.detail)))
        return JSON.parse(atob(it.detail)).amount
      },
    },
    {
      title: 'CreatedAt',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
    },
  ]
  return (
    <>
      <Table columns={columns} dataSource={TradeHistoryList} />
    </>
  )
}
export default TradeHistory
