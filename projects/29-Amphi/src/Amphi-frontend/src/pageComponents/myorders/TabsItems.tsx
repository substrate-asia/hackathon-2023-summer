import React, { useEffect, useState, useCallback } from 'react';
import Jazzicon from 'react-jazzicon';
import { Form, Select, Table, Space, Button, Tooltip, Badge, Avatar } from 'antd';
import { SwitcherOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type IOrder from '@/types/IOrder';
import { serviceTypes, languages } from '@/constants/selcet.json';
// components
import { amountFromToken } from '@/utils/number';
import api from '@/api';
import { optionsMap } from '@/utils/array';
import SBTTag from '@/components/SBTTag';
import SBTImage from '@/constants/sbt';
import { getSubStr } from '@/utils/string';
import { ORDER_STATUS_CODE } from '@/constants/enums';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';

const { Option } = Select;
const formatType = 'YYYY-MM-DD HH:mm:ss'; // HH:mm:ss
const languagesOptions = optionsMap(languages);

const ActionCom = ({ status, id }: any) => {
    const navigate = useNavigate();
    return (
        <Space
            size='small'
            wrap
            onClick={() => {
                navigate(`/orderDetail/${id}`, { state: { id } });
            }}
        >
            <Button type='link' size='small' icon={<EyeOutlined />}>
                View details
            </Button>
            {ORDER_STATUS_CODE.COMPLETED.includes(status) && (
                <Button type='link' size='small' icon={<SwitcherOutlined />}>
                    Rate the service
                </Button>
            )}
            {ORDER_STATUS_CODE.CANCELLED.includes(status) && (
                <Button type='link' size='small' icon={<SwitcherOutlined />}>
                    Order again
                </Button>
            )}
        </Space>
    );
};

const columns: ColumnsType<IOrder> = [
    {
        title: '100 orders',
        key: 'title',
        dataIndex: 'title',
        width: 150,
        render: (value, record) => (
            <Tooltip placement='topLeft' title={value}>
                <p>{value}</p>
                <p className='color-text-desc'>{record?.instruction}</p>
            </Tooltip>
        )
    },
    {
        title: 'Translator',
        key: 'acceptAddress',
        dataIndex: 'acceptAddress',
        ellipsis: true,
        render: (value, record) => {
            const status = record.translationState?.toString();
            const count = record?.params?.count;
            const username = record?.translator?.username;
            const address = record?.translator?.address;
            const profile = record?.translator?.profile;
            const wordsSbt = record?.translator?.badgeSlot?.wordsSbt;

            if (ORDER_STATUS_CODE.PENDING.includes(status))
                return count === 0 ? (
                    <p className='color-text-desc'>No one applied yet</p>
                ) : (
                    <p className='color-text-main'>There are {count} people applying</p>
                );
            if (
                ORDER_STATUS_CODE.IN_SERVICE.includes(status) ||
                ORDER_STATUS_CODE.COMPLETED.includes(status)
            )
                return (
                    <div className='translator-cell'>
                        <div className='address-head-tips'>
                            {profile ? (
                                <Avatar src={profile} size={22} />
                            ) : (
                                <Jazzicon diameter={22} seed={value} />
                            )}
                            <span className='address'>
                                {username || (address ? getSubStr(address) : '')}
                            </span>
                        </div>
                        {wordsSbt && <SBTTag image={SBTImage[wordsSbt]} />}
                    </div>
                );
            if (ORDER_STATUS_CODE.CANCELLED.includes(status))
                return <p className='color-text-main'>--</p>;
            // return ;
        }
    },
    {
        title: 'Amount',
        key: 'bounty',
        dataIndex: 'bounty',
        render: value => `${amountFromToken(value)} USDT`
    },
    {
        title: 'Status',
        key: 'translationState',
        dataIndex: 'translationState',
        ellipsis: true,
        render: value => {
            if (ORDER_STATUS_CODE.PENDING.includes(value))
                return (
                    <Badge
                        status='default'
                        text={<span className='color-text-desc'>Pending payment</span>}
                    />
                );
            if (ORDER_STATUS_CODE.IN_SERVICE.includes(value))
                return <Badge status='warning' text='In service' />;
            if (ORDER_STATUS_CODE.COMPLETED.includes(value))
                return <Badge status='success' text='Completed' />;
            if (ORDER_STATUS_CODE.CANCELLED.includes(value))
                return <Badge status='error' text='Cancelled' />;
        }
    },
    {
        title: 'Times',
        key: 'deadline',
        dataIndex: 'deadline',
        render: value => dayjs(value).format(formatType)
    },
    {
        title: 'Translate Type',
        key: 'translateType',
        dataIndex: 'translateType',
        render: (_, record) =>
            `${languagesOptions.get(record.sourceLang) || '--'} 
            to 
            ${languagesOptions.get(record.targetLang) || '--'}`
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (_, record) => {
            const status = record.translationState?.toString();
            const { id } = record;
            return <ActionCom status={status} id={id} />;
        }
    }
];

export default ({ tabName, status }: { tabName: string; status?: string }) => {
    const [form] = Form.useForm();
    const { address } = useAccount();
    const [loading, setLoading] = useState(true);
    const [dataList, setDataList] = useState<IOrder[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageNum, setPageNum] = useState<number>(1);
    const pageSize = 10;
    const currentDate = dayjs().format(formatType);
    const year = dayjs().year();
    const yearRange = JSON.stringify([
        dayjs().startOf('year').format(formatType),
        dayjs().endOf('year').format(formatType)
    ]);
    const monthRange = JSON.stringify([
        dayjs().subtract(3, 'month').startOf('day').format(formatType),
        currentDate
    ]);
    const dayRange = JSON.stringify([
        dayjs().subtract(30, 'day').startOf('day').format(formatType),
        currentDate
    ]);

    const getOptions = useCallback(() => {
        const { translationTypeArray, createTime } = form.getFieldsValue();
        const options: any = { translationStateArray: status?.split(','), buyerAddress: address };
        if (translationTypeArray.length > 0) {
            options.translationTypeArray = translationTypeArray.join();
        }
        const [beginCreateTime, endCreateTime] = createTime ? JSON.parse(createTime) : [];
        if (beginCreateTime) options.params = { ...options.params, beginCreateTime };
        if (endCreateTime) options.params = { ...options.params, endCreateTime };
        return {
            ...options,
            pageNum,
            pageSize
        };
    }, [form, pageNum]);

    const fetchTranslationList = useCallback(() => {
        setLoading(true);
        api.getTranslationList(getOptions())
            .then((res: any) => {
                setLoading(false);
                if (res.code === 200) {
                    setDataList(res.rows);
                    setTotal(res.total);
                }
            })
            .catch(() => {
                setLoading(false);
            });
    }, [getOptions]);

    useEffect(() => {
        fetchTranslationList();
    }, [fetchTranslationList]);

    const onValuesChange = () => {
        fetchTranslationList();
    };

    const onPageChange = (value: any) => {
        setPageNum(value);
        fetchTranslationList();
    };

    return (
        <>
            <Form
                form={form}
                layout='inline'
                name={tabName}
                onValuesChange={onValuesChange}
                className='filter-content'
                initialValues={{
                    translationTypeArray: ['0', '1', '2', '3'],
                    createTime: ''
                }}
            >
                <Space wrap>
                    <Form.Item
                        name='translationTypeArray'
                        label='Service Type'
                        className='filter-type'
                    >
                        <Select
                            placeholder='Select a option and change input text above'
                            mode='multiple'
                            style={{ minWidth: '360px' }}
                        >
                            {serviceTypes.map(({ value, label }) => (
                                <Option value={value} key={value}>
                                    {label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name='createTime' label='Created at' className='filter-create-time'>
                        <Select placeholder='Select a option and change input text above'>
                            <Option value={dayRange}>last 30 days</Option>
                            <Option value={monthRange}>past 3 months</Option>
                            <Option value={yearRange}>{year}</Option>
                            <Option value=''>all time periods</Option>
                        </Select>
                    </Form.Item>
                </Space>
            </Form>
            <Table
                columns={columns}
                dataSource={dataList}
                loading={loading}
                pagination={{
                    pageSize,
                    current: pageNum,
                    total,
                    showSizeChanger: false,
                    showTotal: value => `Total ${value} items`,
                    onChange: onPageChange
                }}
                scroll={{ x: 'max-content' }}
                bordered
                rowKey='id'
            />
        </>
    );
};
