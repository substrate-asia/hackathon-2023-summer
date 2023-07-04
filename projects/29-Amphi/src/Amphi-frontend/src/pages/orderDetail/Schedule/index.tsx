import { Steps } from 'antd';
import React from 'react';
import AmCard from '@/components/Card';
import arrowLeft from '@/assets/svg/arrow-left.svg';
import verBar from '@/assets/svg/vertical-bar.svg';
import styles from './index.module.scss';

const cardStyle = {
    background: '#FFF',
    padding: '8px 24px 24px'
};
const Schedule = () => {
    return (
        <AmCard cardStyle={cardStyle}>
            <div className={styles['order-detail-top-nav']}>
                <img src={arrowLeft} alt='' />
                <img src={verBar} alt='' className={styles['nav-ver-bar']} />
                <span>Back to my orders</span>
            </div>
            <div className={styles['order-detail-top-steps']}>
                <Steps
                    current={1}
                    items={[
                        {
                            title: 'Submit the order'
                        },
                        {
                            title: 'Pending agreement'
                        },
                        {
                            title: 'In service'
                        },
                        {
                            title: 'Order completed'
                        }
                    ]}
                />
            </div>
        </AmCard>
    );
};

export default Schedule;
