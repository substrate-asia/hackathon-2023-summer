import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Tabs, Table, Tooltip } from 'antd';
import type { TabsProps } from 'antd';
import type { ColumnType } from 'antd/es/table';
// api
import api from '@/api';
// utils
import type BigNumber from 'bignumber.js';
import { amountFromToken } from '@/utils/number';
import { getSubStr } from '@/utils/string';
// types
import type ITransaction from '@/types/ITransaction';
import { currentLanguages, translationTypes, workLoadType } from '@/constants/selcet.json';
// images
import textIcon from '@/assets/svg/text.svg';
import aduioIcon from '@/assets/svg/audio.svg';
import folderIcon from '@/assets/svg/folder.svg';
import { optionsMap } from '@/utils/array';
import HomeSection from '@/pageComponents/home/HomeSection';

const currentLanguagesOptions = optionsMap(currentLanguages);
const translationTypesOptions = optionsMap(translationTypes);
const workLoadTypeOptions = optionsMap(workLoadType);

export default () => {
    const navigate = useNavigate();
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [dataSource1, setDataSource1] = useState<ITransaction[]>([]);
    const [dataSource2, setDataSource2] = useState<ITransaction[]>([]);

    const findIcon = (translationType: string) => {
        if (translationType === '1' || translationType === '2' || translationType === '0')
            return textIcon;
        if (translationType === '3' || translationType === '4') return aduioIcon;
        if (translationType === '5') return folderIcon;
        return '';
    };

    const columns: ColumnType<ITransaction>[] = [
        {
            title: 'REQUEST',
            dataIndex: 'title',
            key: 'name',
            fixed: 'left',
            render: (value: string, record: ITransaction, index: number) => {
                const url = findIcon(record.translationType);
                return (
                    <div className='ranking-name'>
                        <span className='rank-index'>{index + 1}. </span>
                        <img className='rank-icon' src={url} alt='' />
                        <Tooltip title={value}> {getSubStr(value)} </Tooltip>
                    </div>
                );
            }
        },
        {
            title: 'REQUEST TYPE',
            dataIndex: 'translationType',
            key: 'type',
            render: (value: string) => {
                return translationTypesOptions.get(value);
            }
        },
        {
            title: 'FROM',
            dataIndex: 'sourceLang',
            key: 'from',
            render: (value: string) => {
                return currentLanguagesOptions.get(value);
            }
        },
        {
            title: 'TO',
            dataIndex: 'targetLang',
            key: 'to',
            render: (value: string) => {
                return currentLanguagesOptions.get(value);
            }
        },
        {
            title: 'WORKLOAD',
            dataIndex: 'workload',
            key: 'workload',
            render: (value: number, record: ITransaction) => {
                return `${value} ${workLoadTypeOptions.get(record.workloadType)}`;
            }
        },
        {
            title: 'BOUNTY',
            dataIndex: 'bounty',
            key: 'bounty',
            render: (value: BigNumber.Value) => {
                return `${amountFromToken(value, 'format')} USDT`;
            }
        },
        {
            title: 'POSTED',
            dataIndex: 'createTime',
            key: 'posted',
            render: (value: string) => new Date(value).toLocaleString()
        },
        {
            title: 'DEADLINE',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (value: string) => new Date(value).toLocaleString()
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            render: () => (
                <Button
                    type='primary'
                    size='small'
                    onClick={() => {
                        navigate('/myorders');
                    }}
                >
                    Take
                </Button>
            )
        }
    ];

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Top',
            children: (
                <Table
                    rowKey='id'
                    dataSource={dataSource1}
                    loading={loading1}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            )
        },
        {
            key: '2',
            label: `Latest`,
            children: (
                <Table
                    rowKey='id'
                    dataSource={dataSource2}
                    loading={loading2}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            )
        }
    ];

    const operations = (
        <Button
            type='primary'
            onClick={() => {
                navigate('/myorders');
            }}
        >
            More
        </Button>
    );

    const fetchList = (order: '1' | '2') => {
        if (order === '1') setLoading1(true);
        else if (order === '2') setLoading2(true);
        api.ranking({ order })
            .then((res: any) => {
                if (order === '1') setLoading1(false);
                else if (order === '2') setLoading2(false);
                if (res.code === 200) {
                    if (order === '1') setDataSource1(res.rows);
                    else if (order === '2') setDataSource2(res.rows);
                }
            })
            .catch(() => {
                if (order === '1') setLoading1(false);
                else if (order === '2') setLoading2(false);
            });
    };

    useEffect(() => {
        fetchList('1');
    }, []);

    return (
        <HomeSection className='home-bounties' title='Earn Bounties by Translating'>
            <Tabs
                size='large'
                items={items}
                tabBarExtraContent={operations}
                onChange={(activeKey: any) => {
                    fetchList(activeKey);
                }}
            />
        </HomeSection>
    );
};
