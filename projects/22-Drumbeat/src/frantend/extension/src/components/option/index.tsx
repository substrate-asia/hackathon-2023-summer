import { FC, useContext } from "react";
import BaseButton from "../ui/base-button";
import * as U from "../../util";

const Option: FC = () => {
  const { setShowOption } = useContext(U.BaseCtx)
  return (
    <div className={ 'my-20 flex flex-col items-center' }>
      <BaseButton label={ 'Open Web Dapp' } handleClick={ () => {
      } }/>
      <div className={ 'h-10' }></div>
      <BaseButton label={ 'Back Home' } handleClick={ () => {
        setShowOption!(false)
      } }/>
    </div>
  )
}

export default Option;
