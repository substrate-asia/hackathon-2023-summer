import { FC } from 'react'

interface Props {
  label: string
  bg: string
}

const BaseTag: FC<Props> = ({ label, bg }) => {
  return (
    <div
      className='inline-flex rounded mr-1 mb-1'
      style={{
        background: bg,
        padding: '2px 4px',
        zoom: '0.8'
      }}
    >
      <div className='text-white text-xs font-semibold'>{label}</div>
    </div>
  )
}

export default BaseTag;