import {useAccountAndEnsName} from "../../libs/wagmi/hook/UseAccount";

export function Account() {
    const {address, ensName} = useAccountAndEnsName()

    if (!address) {
        return <div>帐号：未连接</div>
    }

    return <div>帐号：{ensName ? `${ensName}(${address})` : address}</div>
}
