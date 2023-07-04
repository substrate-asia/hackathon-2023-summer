import React from 'react';
import AmCard from '@/components/Card';
import IconButton from '@/components/IconButton';
import EditIcon from '@/components/Icon/Edit';
import CancelIcon from '@/components/Icon/Cancel';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import OrderDes from './orderDes';

const { confirm } = Modal;

const cardStyle = {
    background: '#FFF',
    padding: '16px 24px 24px'
};
const titleStyle = {
    marginBottom: '24px'
};

const Detail = () => {
    const showConfirm = () => {
        confirm({
            title: 'Warning!',
            icon: <ExclamationCircleFilled />,
            content: 'Are you sure you want to cancel?',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    const orderRight = (
        <div>
            <IconButton icon={EditIcon} text='Edit order information' />
            <IconButton icon={CancelIcon} text='Cancel the order' onClick={showConfirm} />
        </div>
    );
    return (
        <AmCard
            title='Order Detail'
            cardStyle={cardStyle}
            titleStyle={titleStyle}
            rightContent={orderRight}
        >
            <OrderDes />
        </AmCard>
    );
};

export default Detail;
