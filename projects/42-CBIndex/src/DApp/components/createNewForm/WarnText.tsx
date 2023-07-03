import React from 'react'

const WarnText = (props: any) => {
  return (
    <div className="bg-base-300 overflow-auto rounded-lg  border border-yellow-900 p-4 font-normal text-zinc-400 shadow-lg">
      {props.children}
    </div>
  )
}
export default WarnText
