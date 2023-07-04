import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Avatar, Col, Row, Space, Spin } from 'antd';
import dayjs from 'dayjs';
import api from '@/api';
import { optionsMap } from '@/utils/array';
import { languages } from '@/constants/selcet.json';
import IconTranslation from '@/assets/svg/icon-translation.svg';
import EmptyCom from './EmptyCom';

const languagesMap = optionsMap(languages);

interface IProjectProps {
    id: number;
    title: string;
    sourceLang: string;
    targetLang: string;
    translationCharacter: string;
    updateTime: string;
}
const ProjectItem = ({
    title,
    sourceLang,
    targetLang,
    translationCharacter,
    updateTime
}: IProjectProps) => {
    return (
        <div className='project-item-box'>
            <p className='title'>{title}</p>
            <Space className='lang-box'>
                <Avatar src={IconTranslation} size={24} />
                <p className='lang'>
                    {languagesMap.get(sourceLang)} → {languagesMap.get(targetLang)}
                </p>
            </Space>
            <p>
                <span className='label color-text-desc'>Role:</span>
                {translationCharacter}
            </p>
            <p>
                <span className='label color-text-desc'>Completed on:</span>
                {dayjs(updateTime).format('YYYY/MM/DD')}
            </p>
        </div>
    );
};

export default ({ setCompletedNum }: any) => {
    const [search] = useSearchParams();
    const searchAddress = search.get('address');
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [dataList, setDataList] = useState<IProjectProps[]>([]);

    const fetchList = useCallback((addr: string) => {
        if (addr) {
            api.getProjectList({ address: addr })
                .then((res: any) => {
                    setLoading(false);
                    if (res?.code === 200) {
                        setDataList(res.rows);
                        setCompletedNum(res.total);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        const addr = searchAddress || address;
        if (addr) fetchList(addr);
    }, [searchAddress, address]);

    return (
        <Spin spinning={loading}>
            {Array.isArray(dataList) && dataList.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {!!dataList?.length &&
                        dataList.map((item: IProjectProps) => (
                            <Col md={12} lg={8} xl={6} key={item.id}>
                                <ProjectItem {...item} />
                            </Col>
                        ))}
                </Row>
            ) : (
                <EmptyCom />
            )}
        </Spin>
    );
};
