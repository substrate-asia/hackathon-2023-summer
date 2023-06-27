import { useState } from "react";
import { Logo } from "../../assets";
import { FaWallet } from "react-icons/fa";

function Wallet() {
  const [isConnect, setConnect] = useState(false);
  return (
    <div className="flex flex-row ">
      <div
        className="px-3 py-0 flex flex-row justify-center items-center border-solid border rounded-3xl hover:cursor-pointer"
        onClick={() => setConnect(!isConnect)}
      >
        <FaWallet />
        <span className="pl-1">
          {isConnect
            ? getShortenAddress("0x9AF803510A19eF61AC57CE73D4a892A387Ba40E4")
            : "Connect"}
        </span>
      </div>
      <div className="px-3 py-1 flex flex-row justify-start items-center border-solid border rounded-3xl ml-10">
        <img src={Logo} alt="" className="w-8 h-8" />
        <span className="pl-1">Dondelion</span>
        {/* <span className="pl-1"> Connect</span> */}
      </div>
    </div>
  );
}

function getShortenAddress(address: string, place = 6) {
  return address
    ? `${address.slice(0, place)}${".".repeat(place)}${address.slice(-place)}`
    : "";
}
export default Wallet;
