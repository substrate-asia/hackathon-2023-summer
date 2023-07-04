import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

interface IProps {
    headName?: string;
    items: MenuProps['items'][];
}

const AmDropdown: React.FC<IProps> = ({ headName, items }: any) => (
    <Dropdown menu={{ items }} placement='bottom'>
        <span>{headName}</span>
    </Dropdown>
);

export default AmDropdown;
