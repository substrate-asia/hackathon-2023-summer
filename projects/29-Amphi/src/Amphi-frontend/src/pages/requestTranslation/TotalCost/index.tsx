import React from 'react';
import AmCard from '@/components/Card';
import { useAppSelector } from '@/store/hooks';
import { totalCost, amphiServiceCost, bounty } from '@/store/reducers/requestTransSlice';
import { Tooltip } from 'antd';

import styles from './index.module.scss';

const TotalCost = () => {
    const amServiceCost = useAppSelector(amphiServiceCost);
    const amTotalCost = useAppSelector(totalCost);
    const amBounty = useAppSelector(bounty);
    return (
        <AmCard title='Total cost'>
            <ul className={styles['total-cost-list']}>
                <Tooltip title='1000words/55U' placement='top'>
                    <li>
                        <span>Amphi service cost(?)</span>
                        <strong>{`${amServiceCost} USDT`}</strong>
                    </li>
                </Tooltip>
                {/* <li>
                    <span>Translator Fee</span>
                    <strong>200 USDT</strong>
                </li> */}
                <li>
                    <span>Bounty</span>
                    <strong>{`${amBounty} USDT`}</strong>
                </li>
                <li>
                    <span>Total</span>
                    <strong>{amTotalCost} USDT</strong>
                </li>
            </ul>
        </AmCard>
    );
};

export default TotalCost;
