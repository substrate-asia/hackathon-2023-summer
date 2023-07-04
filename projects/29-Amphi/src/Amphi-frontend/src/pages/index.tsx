import React from 'react';
import type { FC } from 'react';
import { Row, Col, Card } from 'antd';
// components
import RequestTransForm from '@/components/RequestTransForm';
// images
import ImageAbout1 from '@/assets/images/about1.png';
import ImageAbout2 from '@/assets/images/about2.png';
import ImageAbout3 from '@/assets/images/about3.png';
import ImageAbout4 from '@/assets/images/about4.png';
import HomeSection from '@/pageComponents/home/HomeSection';
import Bounties from '@/pageComponents/home/Bounties';
import Translators from '@/pageComponents/home/Translators';
import './index.scss';

const { Meta } = Card;

// const Banner: FC = () => {
//     return (
//         <div className='home-banner'>
//             <h1>A new language service</h1>
//             <h1 className='primary'>marketplace</h1>
//             <h3>AI translation + human proofreading marketplace</h3>
//             <Button size='large' className='primary'>
//                 Go now
//             </Button>
//         </div>
//     );
// };

const dataList = [
    {
        title: 'Decentralized',
        imageUrl: ImageAbout1,
        description:
            'Increase translation process efficiency, One-station language service platform.'
    },
    {
        title: 'Earn',
        imageUrl: ImageAbout2,
        description: 'Increase accuracy of AI model with specific database.'
    },
    {
        title: 'Trustless',
        imageUrl: ImageAbout3,
        description:
            'More convenient settlement, native web3 Dapp supports cryptocurrency payments.'
    },
    {
        title: 'Transparemt',
        imageUrl: ImageAbout4,
        description: 'Translator build influence in Amphi and sync propagate to the world.'
    }
];

const index: FC = () => {
    return (
        <div>
            {/* banner */}
            {/* <Banner /> */}
            {/* Earn Bounties by Translating */}
            <Bounties />
            {/* Our Translators */}
            <Translators />
            {/* Get your professional translation */}
            <HomeSection
                className='home-prof-translation'
                title='Get your professional translation'
            >
                <RequestTransForm isRequired={false} size='large' />
            </HomeSection>
            {/* What Does Amphi do */}
            <HomeSection className='home-aboutus' title='What Does Amphi do'>
                <Row gutter={[50, 60]}>
                    {dataList.map(({ title, imageUrl, description }) => (
                        <Col xs={10} sm={10} md={8} lg={6} xl={6} key={title}>
                            <Card cover={<img alt='example' src={imageUrl} />}>
                                <Meta title={title} description={description} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </HomeSection>
        </div>
    );
};

export default index;
