import React from 'react'
import Statistic from 'antd/lib/statistic'
const ParseMoney = (props: any) => {
  const { num, textColor, fontSize } = props
  return (
    <div className="flex">
      <Statistic
        value={num}
        precision={2}
        prefix="$"
        valueStyle={{
          color: textColor ? textColor : 'white',
          fontSize: fontSize ? fontSize : 14,
        }}
      />
    </div>
  )
}

export default ParseMoney
