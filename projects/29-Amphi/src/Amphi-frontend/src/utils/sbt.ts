import api from '@/api/index';
import { message } from 'antd';
import type { IBadgeItem, ISlotItem, TTokenId } from '@/types/ISBT';

export const wearBadge = async ({
    address,
    wordsSbt
}: {
    address: string;
    wordsSbt: TTokenId;
}): Promise<void> => {
    const res = await api.wearBadge({ address, wordsSbt });
    if (res?.code === 200) {
        message.success(res.msg);
    } else {
        message.error(res.msg);
    }
};

export const takeOffBadge = async (address: string): Promise<void> => {
    const res = await api.wearBadge({ address, wordsSbt: '' });
    if (res?.code === 200) {
        message.success(res.msg);
    } else {
        message.error(res.msg);
        throw Error(res.msg);
    }
};

export const getBadgeSlot = async (address: string): Promise<ISlotItem[]> => {
    const res = await api.getBadgeSlot({ address });
    if (res?.code === 200) {
        return res?.data || [];
    }
    throw Error(res.msg);
};

export const getAllBadgeList = async (address: string): Promise<IBadgeItem[]> => {
    const res = await api.getBadgeList({ address });
    if (res?.code === 200) {
        return res?.data || [];
    }
    throw Error(res.msg);
};

export const getNeedRemindBadgeList = async (address: string): Promise<IBadgeItem[]> => {
    const res = await api.getBadgeList({ address, isRemind: 0 });
    if (res?.code === 200) {
        return res.data;
    }
    throw Error(res.msg);
};

// 提醒完用户有新徽章后调用
export const isRemindBadge = async ({
    address,
    tokenId,
    tokenIds
}: {
    address: string;
    tokenId?: TTokenId;
    tokenIds?: TTokenId[];
}): Promise<void> => {
    api.isRemindBadge({ address, tokenId, tokenIds });
};
