import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import type { IBadgeItem, ISlotItem, ITokenURI, TTokenId } from '@/types/ISBT';
import {
    getBadgeSlot,
    getAllBadgeList,
    isRemindBadge,
    wearBadge,
    takeOffBadge,
    getNeedRemindBadgeList
} from '@/utils/sbt';
import { getSBTContract } from '@/contracts/contract';
import storage from '@/utils/storage';
import { AMPHI_USERTOKEN } from '@/constants/storageKeys';

const useSBT = (paramAddress?: string) => {
    const { address: userAddress } = useAccount();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    // 需要查询的地址
    const [address, setAddress] = useState(paramAddress || userAddress);
    // 是否和登录的地址是同一个
    const [isCurrentAddress, setTsCurrentAddress] = useState(
        !paramAddress || paramAddress === userAddress
    );
    // 是否需要提醒
    const [isNeedRemind, setIsNeedRemind] = useState(false);
    // 拥有的所有徽章列表
    const [ownedList, setOwnedList] = useState<IBadgeItem[]>([]);
    // 需要提醒的徽章列表
    const [remindList, setRemindList] = useState<IBadgeItem[]>([]);
    // 插槽列表
    const [slotList, setSlotList] = useState<ISlotItem[]>([]);

    useEffect(() => {
        if (!paramAddress || paramAddress === userAddress) {
            setAddress(userAddress);
            setTsCurrentAddress(true);
        } else {
            setAddress(paramAddress);
            setTsCurrentAddress(false);
        }
    }, [paramAddress, userAddress]);

    const getLoginStatus = useCallback(() => {
        const token = storage.getLocalStorage(AMPHI_USERTOKEN);
        if (token) setIsLogin(true);
        else setIsLogin(false);
    }, []);

    useEffect(() => {
        let timer: any;
        if (address) {
            getLoginStatus();
            timer = setInterval(() => {
                getLoginStatus();
            }, 3000);
        }
        if (isLogin && userAddress) clearInterval(timer);
        return () => {
            clearInterval(timer);
            timer = null;
        };
    }, [isLogin, address, getLoginStatus, userAddress]);

    const fetchData = useCallback(async () => {
        if (address) {
            setLoading(true);
            try {
                const [slotRes, allRes] = await Promise.all([
                    getBadgeSlot(address),
                    getAllBadgeList(address)
                ]);
                setSlotList(slotRes);
                setOwnedList(allRes);
                setLoading(false);
            } catch (error) {
                console.log('useSBT fetchData error===>', error);
                setLoading(false);
            }
        }
    }, [address]);

    const fetchRemindData = useCallback(async () => {
        if (isLogin && isCurrentAddress) {
            setLoading(true);
            try {
                const remindRes = await getNeedRemindBadgeList(address as string);
                // 当有为0的记录时是需要提醒的记录（弹窗）
                if (remindRes) {
                    setRemindList(remindRes);

                    // 提醒完用户有新徽章后调用
                    if (remindRes.length > 0) {
                        setIsNeedRemind(true);

                        let tokenId;
                        let tokenIds;
                        if (remindRes.length === 1) tokenId = remindRes[0].tokenId;
                        if (remindRes.length > 1)
                            tokenIds = remindRes.map((item: IBadgeItem) => item.tokenId);
                        isRemindBadge({ address, tokenId, tokenIds });
                    } else setIsNeedRemind(false);
                }
                setLoading(false);
            } catch (error) {
                console.log('useSBT fetchRemindData error===>', error);
                setLoading(false);
            }
        }
    }, [address, isCurrentAddress, isLogin]);

    useEffect(() => {
        if (address && isLogin) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isLogin]);

    useEffect(() => {
        if (address && isCurrentAddress && isLogin) fetchRemindData();
    }, [address, fetchRemindData, isCurrentAddress, isLogin]);

    const handleWear = useCallback(
        async (tokenId: TTokenId) => {
            if (address) {
                await wearBadge({ address, wordsSbt: tokenId });
                fetchData();
            }
        },
        [address, fetchData]
    );
    const handleTakeOffBadge = useCallback(async () => {
        if (address) {
            await takeOffBadge(address);
            fetchData();
        }
    }, [address, fetchData]);

    const getSBTInfo = useCallback(async (tokenId: TTokenId): Promise<ITokenURI | {}> => {
        const SBTContract = await getSBTContract();
        const res: string = await SBTContract.methods.getTokenURI(tokenId).call();
        if (!res) return {};
        return JSON.parse(res);
    }, []);

    return {
        loading,
        isNeedRemind,
        ownedList,
        slotList,
        remindList,
        isCurrentAddress,
        handleWear,
        handleTakeOffBadge,
        getSBTInfo
    };
};

export default useSBT;
