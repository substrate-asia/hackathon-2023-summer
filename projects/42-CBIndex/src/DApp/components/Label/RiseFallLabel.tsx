import React from 'react'
const RiseFallLabel = (props: any) => {
  const { num, after } = props
  if (num >= 0) {
    return (
      <div>
        {num}
        {after}
      </div>
    )
  } else {
    return (
      <div>
        {num}
        {after}
      </div>
    )
  }

  //   return <>RiseFallLabel</>
}
export default RiseFallLabel
