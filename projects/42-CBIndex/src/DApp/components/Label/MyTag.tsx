import React from 'react'
import { Tag } from 'antd'

const MyTag = (props: any) => {
  const { color, text } = props
  return (
    <div>
      <Tag color={color}>{text}</Tag>
    </div>
  )
}

export default MyTag
