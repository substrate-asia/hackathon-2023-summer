import React from 'react';
import styles from './index.module.scss';

type IProps = {
    title: string;
};
export default ({ title }: IProps) => (
    <div className={styles['page-title']}>
        <h6>{title}</h6>
    </div>
);
