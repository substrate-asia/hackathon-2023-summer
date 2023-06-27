import { useCallback } from "react";
import { Logo } from "../../assets";
import { FaWallet } from "react-icons/fa";
import { useConnectors, WagmiConnectorStatus } from "../../libs/wagmi/hook/UseConnector";
import { useAccount, useDisconnect } from "wagmi";

function Wallet() {
  const {address} = useAccount() // 当前连接的账号
  const {connect, connectors: [{status, conn}]} = useConnectors()
  const {disconnect} = useDisconnect()
  const onClick = useCallback(() => {
    switch (status) {
      case WagmiConnectorStatus.unconnected:
        connect({connector: conn}) // 连接
        break;
      case WagmiConnectorStatus.connected:
        disconnect() // 断开连接
        break;
    }
  }, [status, conn, connect, disconnect])

  return (
    <div className="flex flex-row ">
      <div
        className="px-3 py-0 flex flex-row justify-center items-center border-solid border rounded-3xl hover:cursor-pointer"
        onClick={onClick}
      >
        <FaWallet />
        <span className="pl-1">
          {address ? getShortenAddress(address) : "Connect"}
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
