import { FC } from "react";

const Level: FC = () => {
  return (
    <div className={'my-10'}>
      <div className={'text-xl font-bold text-white mb-4'}>Your Level</div>
      <div className={'flex items-center mb-2'}>
        <div className={'w-[20%] h-2 bg-orange-500'}></div>
        <div className={'w-[80%] h-2 bg-gray-500'}></div>
      </div>
      <div className={'flex items-center justify-between'}>
        <div className={'text-orange-500'}>Current Level: 5</div>
        <div className={'text-gray-500'}>Next Level: 6</div>
      </div>
    </div>
  )
}

export default Level
