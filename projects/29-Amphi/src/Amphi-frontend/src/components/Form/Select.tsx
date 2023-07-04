import React from 'react';
import { Select } from 'antd';

interface IProps {
    defaultValue: string | undefined;
    size?: 'large' | 'middle' | 'small';
    placeholder?: string;
    options: { value: string; label: string }[];
    onChange?: (value: any, opiton: any) => void;
}
const AmSelect = ({ defaultValue, size, placeholder, options, onChange }: IProps) => {
    return (
        <Select
            defaultValue={defaultValue}
            size={size}
            showSearch
            allowClear
            placeholder={placeholder}
            optionFilterProp='label'
            options={options}
            onChange={onChange}
        />
    );
};

export default AmSelect;
