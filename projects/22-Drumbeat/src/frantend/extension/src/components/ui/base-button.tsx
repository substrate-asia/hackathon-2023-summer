import { FC } from "react";

interface Prop {
  label: string
  handleClick: () => void
  disable?: boolean
}

const BaseButton: FC<Prop> = ({ label, handleClick, disable = false }) => {
  return (
    <div
      className={`px-6 py-2 ${disable ? 'bg-gray-300' : 'bg-theme-bg-color'} inline-flex justify-center items-center rounded-full hover:opacity-80 cursor-pointer select-none`}
      onClick={() => {
        if (!disable) {
          handleClick()
        }
      }}
    >
      <div className={`${disable ? 'text-gray-200' : 'text-white'} text-base font-bold`}>{label}</div>
    </div>
  )
}

export default BaseButton;
