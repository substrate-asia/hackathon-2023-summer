import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
// components
import PageTitle from '@/components/PageTitle';
import TabsItems from '@/pageComponents/myorders/TabsItems';
import './index.scss';
import { ORDER_STATUS_CODE } from '@/constants/enums';

// status 对应的状态
// 下面的状态我是简写的，你按UI上的文案来
// 0 pending
// 1  2  3 in service
// 5  completed
// 4  6   cancell

const items: TabsProps['items'] = [
    {
        key: '1',
        label: `All Orders`,
        children: <TabsItems tabName='orders' />
    },
    {
        key: '2',
        label: `Pending payment`,
        children: <TabsItems tabName='payment' status={ORDER_STATUS_CODE.PENDING} />
    },
    {
        key: '3',
        label: `In service`,
        children: <TabsItems tabName='service' status={ORDER_STATUS_CODE.IN_SERVICE} />
    },
    {
        key: '4',
        label: `Completed`,
        children: <TabsItems tabName='completed' status={ORDER_STATUS_CODE.COMPLETED} />
    },
    {
        key: '5',
        label: `Cancelled`,
        children: <TabsItems tabName='cancelled' status={ORDER_STATUS_CODE.CANCELLED} />
    }
];

export default () => {
    const onChange = (key: string) => {
        console.log(key);
    };
    return (
        <>
            <PageTitle title='My Orders' />
            <div className='order-tabs-content'>
                <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
            </div>
        </>
    );
};
