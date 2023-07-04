import type { ReactNode } from 'react';
import React from 'react';
import styles from './index.module.scss';

interface Iprops {
    title?: string;
    children: ReactNode;
    rightContent?: any;
    cardStyle?: {};
    titleStyle?: {};
    className?: string;
}

const AmCard = ({
    title = '',
    children,
    rightContent,
    cardStyle,
    titleStyle,
    className
}: Iprops) => {
    return (
        <div className={`${styles['request-trans-card']} ${className}`} style={cardStyle}>
            <div className={styles['request-trans-card-title']} style={titleStyle}>
                {title ? <h6>{title}</h6> : ''}
                <div>{rightContent}</div>
            </div>
            {children}
        </div>
    );
};

export default AmCard;
