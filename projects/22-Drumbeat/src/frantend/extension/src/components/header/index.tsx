import { FC, useContext } from "react";
import Logo from "../svg/logo";
import BaseButton from "../ui/base-button";
import * as U from "../../util";

const Header: FC = () => {
  const { showOption, setShowOption } = useContext(U.BaseCtx)
  return (
    <div className="w-full h-12 pl-4 pr-4 flex flex-row items-center mb-4 justify-between bg-white">
      <Logo/>
    </div>
  )
}

export default Header;
