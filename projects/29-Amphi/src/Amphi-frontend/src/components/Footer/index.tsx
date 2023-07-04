import React from 'react';
import { Layout } from 'antd';
import whiteLogo from '@/assets/svg/logoWhite.svg';
import footerRadius from '@/assets/svg/footerRadius.svg';
import { footerShares } from '@/constants/pageData';
import styles from './index.module.scss';

const { Footer } = Layout;

const AmFooter = () => {
    return (
        <Footer className={styles['amphi-footer']}>
            <img src={footerRadius} alt='' />
            <div className={styles.copyright}>
                <img src={whiteLogo} alt='logo' />
                <p>© {new Date().getFullYear() - 1} Amphi. All rights reserved</p>
            </div>
            <div className={styles.shares}>
                {footerShares.map(share => {
                    return (
                        <a target='_blank' href={share.link} key={share.key} rel='noreferrer'>
                            <img alt='icon' src={share.icon} />
                        </a>
                    );
                })}
            </div>
        </Footer>
    );
};

export default AmFooter;
