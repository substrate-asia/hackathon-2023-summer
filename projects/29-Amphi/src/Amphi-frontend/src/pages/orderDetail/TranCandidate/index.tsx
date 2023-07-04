import React from 'react';
import AmTable from '@/components/Table';
import AmCard from '@/components/Card';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Candidate',
        dataIndex: 'candidate',
        key: 'candidate'
    },
    {
        title: 'Order quantity',
        dataIndex: 'orderQuantity',
        key: 'orderQuantity'
    },
    {
        title: 'Score',
        dataIndex: 'score',
        key: 'score'
    },
    {
        title: 'Language',
        dataIndex: 'language',
        key: 'language'
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message'
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation'
    }
];
const data: DataType[] = [];

const TranCandidate = () => {
    return (
        <AmCard title='Translation candidate'>
            <AmTable columns={columns} data={data} />
        </AmCard>
    );
};

export default TranCandidate;
