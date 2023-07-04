import React from 'react';
import Schedule from './Schedule';
import Detail from './Detail';
import TranCandidate from './TranCandidate';
import TranContent from './TranContent';
import Notification from './Notification';
import styles from './index.module.scss';
// import routes from '~react-pages';

const OrderDetail = () => {
    return (
        <div className={styles['order-detail-wrapper']}>
            <Schedule />
            <Detail />
            <TranCandidate />
            <TranContent />
            <Notification />
        </div>
    );
};

export default OrderDetail;
