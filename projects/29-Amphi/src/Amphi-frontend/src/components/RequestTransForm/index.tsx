import React from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { currentLanguages, translationTypes } from '@/constants/selcet.json';
import { useNavigate } from 'react-router';

interface IProps {
    isRequired?: boolean;
    size?: 'large' | 'middle' | 'small';
}

export default ({ isRequired = true, size = 'middle' }: IProps) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const selectList = [
        {
            label: 'Translate from',
            name: 'sourceLang',
            rules: isRequired ? [{ required: true, message: 'Please select Translate from' }] : [],
            placeholder: 'Select a language',
            options: currentLanguages
        },
        {
            label: 'Translate to',
            name: 'targetLang',
            rules: isRequired ? [{ required: true, message: 'Please select Translate to' }] : [],
            placeholder: 'Select a language',
            options: currentLanguages
        },
        {
            label: 'Service Type',
            name: 'translationType',
            rules: isRequired ? [{ required: true, message: 'Please select Service Type' }] : [],
            placeholder: 'Select a Service Type',
            options: translationTypes
        }
    ];
    const handleStart = () => {
        const values = form.getFieldsValue();
        navigate('/requestTranslation', { state: values });
    };
    return (
        <Form form={form} layout='vertical' initialValues={{}} autoComplete='off'>
            <Row align='bottom' gutter={20}>
                {selectList.map(({ label, name, rules, placeholder, options }) => (
                    <Col flex='auto' key={name}>
                        <Form.Item label={label} name={name} rules={rules}>
                            <Select
                                size={size}
                                showSearch
                                allowClear
                                placeholder={placeholder}
                                optionFilterProp='label'
                                options={options}
                            />
                        </Form.Item>
                    </Col>
                ))}
                {isRequired ? null : (
                    <Col flex='auto'>
                        <Form.Item>
                            <Button type='primary' size='large' ghost block onClick={handleStart}>
                                Start
                            </Button>
                        </Form.Item>
                    </Col>
                )}
            </Row>
        </Form>
    );
};
