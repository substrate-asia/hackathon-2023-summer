import { FC, ReactNode } from 'react'

type Props = {
  label: string,
  handleClick: () => void,
  h?: string,
  px?: string,
  borderColor?: string,
  color?: string,
  fSize?: string,
  bg?: string,
  icon?: ReactNode
}

const Button: FC<Props> = ({label, handleClick, h = 'h-[3rem]', px = 'px-[1.25rem]', borderColor = 'border-[#3772FF]', color = 'text-white', fSize = 'text-[1.25rem]', bg = 'bg-[#3772FF]', icon}) => {
  return (
    <div
      className={`inline-flex ${h} ${bg} ${px} rounded-full cursor-pointer items-center hover:opacity-80 border ${borderColor} box-border`}
      onClick={handleClick}
    >
      <div className={`${color} ${fSize} text-r-semi-bold`}>{label}</div>
      {icon && <div className='w-[.5rem]'></div>}
      {icon}
    </div>
  )
}

export default Button