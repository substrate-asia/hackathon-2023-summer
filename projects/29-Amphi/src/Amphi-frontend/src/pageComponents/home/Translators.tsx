import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge } from 'antd';
import { StarFilled } from '@ant-design/icons';
import type ITranslators from '@/types/ITranslator';
// api
import api from '@/api';
// components
import { languages as languagesOptions } from '@/constants/selcet.json';
// images
import ImageTranslator from '@/assets/images/translator.png';
import { optionsMap } from '@/utils/array';
import HomeSection from '@/pageComponents/home/HomeSection';

const { Meta } = Card;

const languagesMap = optionsMap(languagesOptions);

const DescItem = ({
    languages,
    orders,
    score
}: Pick<ITranslators, 'languages' | 'orders' | 'score'>) => (
    <>
        {languages ? (
            <p>
                I speak{' '}
                {languages
                    .map(({ workLangValue }: any) => languagesMap.get(workLangValue.toString()))
                    .join('、')}
            </p>
        ) : null}
        <Badge color='#D9D9D9' text={`${orders || '--'} orders`} />
        <p>
            <StarFilled style={{ color: '#333', fontSize: 10 }} />
            &nbsp;&nbsp;{score}
        </p>
    </>
);

export default () => {
    const [dataList, setDataList] = useState<ITranslators[]>([]);

    useEffect(() => {
        api.getTranslatorList().then((res: any) => {
            if (res.code === 200) {
                setDataList(res.rows);
            }
        });
    }, []);

    return (
        <HomeSection className='home-translators' title='Our Translators'>
            <Row gutter={[50, 60]}>
                {dataList.map(({ id, address, username, profile, languages, orders, score }) => (
                    <Col xs={10} sm={10} md={8} lg={6} xl={6} key={id}>
                        <Card
                            cover={
                                <img
                                    alt='example'
                                    src={profile}
                                    onError={e => {
                                        e.target.src = ImageTranslator;
                                    }}
                                />
                            }
                        >
                            <Meta
                                title={username || address}
                                description={
                                    <DescItem languages={languages} orders={orders} score={score} />
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </HomeSection>
    );
};
