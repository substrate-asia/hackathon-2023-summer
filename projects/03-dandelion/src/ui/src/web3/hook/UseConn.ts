import {useCallback} from "react";
import {useDisconnect} from "wagmi";
import {useConnectors, WagmiConnectorStatus} from "../../libs/wagmi/hook/UseConnector";

export function useConn(): [WagmiConnectorStatus, () => void] {
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

  return [status, onClick]
}
