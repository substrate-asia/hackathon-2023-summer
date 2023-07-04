import React from 'react';
import selectedIcon from '@/assets/svg/summary-selected.svg';
import unSelectedIcon from '@/assets/svg/summary-unselected.svg';
import { useAppSelector } from '@/store/hooks';
import {
    summaryWorkload,
    summaryTransLang,
    summaryServiceType,
    summaryDeadline
} from '@/store/reducers/requestTransSlice';
import AmCard from '@/components/Card';
import styles from './index.module.scss';

const SummaryCard = () => {
    const workload = useAppSelector(summaryWorkload);
    const transLang = useAppSelector(summaryTransLang);
    const serviceType = useAppSelector(summaryServiceType);
    const deadline = useAppSelector(summaryDeadline);
    return (
        <AmCard title='Summary'>
            <ul className={styles['summary-list']}>
                <li>
                    <span>Translation Language</span>
                    <img src={transLang === '-' ? unSelectedIcon : selectedIcon} alt='' />
                </li>
                <p>{transLang}</p>
                <li>
                    <span>Service Type</span>
                    <img src={serviceType ? selectedIcon : unSelectedIcon} alt='' />
                </li>
                <p>{serviceType || '-'}</p>
                <li>
                    <span>Workload</span>
                    <img src={workload ? selectedIcon : unSelectedIcon} alt='' />
                </li>
                <p>{workload ? `${workload} words` : '-'}</p>
                <li>
                    <span>Deadline</span>
                    <img src={deadline ? selectedIcon : unSelectedIcon} alt='' />
                </li>
                <p>{deadline || '-'}</p>
            </ul>
        </AmCard>
    );
};

export default SummaryCard;
