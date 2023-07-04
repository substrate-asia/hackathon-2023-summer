import React from 'react';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import DateIcon from '../Icon/Date';

interface IProps {
    placeholder: string;
    onChange: (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string
    ) => void;
}
const AmDateTimePiker = ({ placeholder, onChange }: IProps) => {
    // const onChange = (
    //     value: DatePickerProps['value'] | RangePickerProps['value'],
    //     dateString: [string, string] | string
    // ) => {
    //     console.log('Selected Time: ', value);
    //     console.log('Formatted Selected Time: ', dateString);
    // };
    // const range = (start: number, end: number) => {
    //     const result = [];
    //     for (let i = start; i < end; i++) {
    //         result.push(i);
    //     }
    //     return result;
    // };

    const disabledDate: RangePickerProps['disabledDate'] = current => {
        // Can not select days before today
        return current && current <= dayjs().endOf('hour');
    };
    // const disabledDateTime = () => ({
    //     disabledHours: () => range(0, 24).splice(0, 3),
    //     disabledMinutes: () => range(30, 60),
    //     disabledSeconds: () => [0, 56]
    // });

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };
    return (
        <DatePicker
            allowClear
            autoFocus
            placeholder={placeholder}
            format='YYYY-MM-DD HH:mm:ss'
            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
            disabledDate={disabledDate}
            // disabledTime={disabledDateTime}
            onChange={onChange}
            onOk={onOk}
            suffixIcon={<DateIcon />}
            style={{
                backgroundColor: '#F2F2FB',
                width: '100%'
            }}
        />
    );
};

export default AmDateTimePiker;
