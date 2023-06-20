import {Account} from "../connector/Account";
import {Connectors} from "../connector/Connectors";
import {NetworkSwitcher} from "../connector/NetworkSwitcher";

export function ConnectorDemo() {
    return <>
        <Account/>
        <Connectors/>
        <NetworkSwitcher/>
    </>
}
