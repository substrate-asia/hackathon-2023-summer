import {useAccount} from "wagmi";

export function Account() {
    const {address} = useAccount()

    if (!address) {
        return <div>帐号：未连接</div>
    }

    return <div>帐号：{address}</div>
}
