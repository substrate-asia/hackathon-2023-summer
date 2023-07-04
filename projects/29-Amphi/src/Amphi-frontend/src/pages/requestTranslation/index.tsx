import React from 'react';
import PageTitle from '@/components/PageTitle';
import RequestForm from './Form';
import SummaryCard from './Summary';
import TotalCostCard from './TotalCost';
import styles from './index.module.scss';

const RequestTranslation = () => {
    return (
        <>
            <PageTitle title='Get your professional translation' />
            <main className={styles['request-trans-wrapper']}>
                <div className={styles['request-trans-left']}>
                    <RequestForm />
                </div>
                <div className={styles['request-trans-right']}>
                    <SummaryCard />
                    <TotalCostCard />
                    {/* <ConfirmOrderCard onSave={hanldeSaveOrder} /> */}
                </div>
            </main>
        </>
    );
};

export default RequestTranslation;
