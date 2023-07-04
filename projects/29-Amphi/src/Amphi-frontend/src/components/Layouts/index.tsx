import type { ReactNode } from 'react';
import React from 'react';
// import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Banner from '../Banner';
import AmHeader from '../Header';
import AmFooter from '../Footer';
import styles from './index.module.scss';

const { Content } = Layout;

type IProps = {
    isShowBanner: boolean;
    children: ReactNode;
};
const Layouts = ({ isShowBanner = false, children }: IProps) => {
    return (
        <Layout>
            {isShowBanner ? (
                <div className={styles['amphi-layout']}>
                    <AmHeader />
                    <Banner />
                </div>
            ) : (
                <AmHeader />
            )}
            <Content>
                {/* <Outlet /> */}
                {children}
            </Content>
            <AmFooter />
        </Layout>
    );
};

export default Layouts;
