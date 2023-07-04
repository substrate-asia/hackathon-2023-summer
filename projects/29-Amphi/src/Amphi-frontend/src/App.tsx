import React, { Suspense } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { Spin } from 'antd';
import Layouts from '@/components/Layouts';
import { NoticeProvider } from '@/context/NoticeProvider';
import routes from '~react-pages';

// eslint-disable-next-line no-console
// console.log(routes)

function App() {
    const location = useLocation();
    return (
        <NoticeProvider>
            <Layouts isShowBanner={location.pathname === '/'}>
                <Suspense
                    fallback={
                        <div
                            style={{
                                textAlign: 'center',
                                paddingTop: '100px',
                                paddingBottom: '100px'
                            }}
                        >
                            <Spin />
                        </div>
                    }
                >
                    {useRoutes(routes)}
                </Suspense>
            </Layouts>
        </NoticeProvider>
    );
}

export default App;
