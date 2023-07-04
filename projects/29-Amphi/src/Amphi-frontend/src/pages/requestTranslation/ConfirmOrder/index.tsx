import React from 'react';

import AmCard from '@/components/Card';
import { Button } from 'antd';
import styles from './index.module.scss';

const ConfirmOrders = ({ onSave }: { onSave: () => void }) => {
    return (
        <AmCard title='Money Back Guarantee'>
            <div className={styles['confirme-order-box']}>
                <ul>
                    <li>After payment, you can cancel the order for free within 30 minutes.</li>
                    <li>
                        If no translator accepts the order within 24 hours, the bounty will be
                        refunded.
                    </li>
                </ul>
                {/* 
                
                    // 1. 触发form验证
                    // 2.提交数据
                */}
                <Button
                    type='primary'
                    htmlType='submit'
                    className={styles['confirm-btn']}
                    onClick={onSave}
                >
                    Confirm Order
                </Button>
            </div>
        </AmCard>
    );
};

export default ConfirmOrders;
