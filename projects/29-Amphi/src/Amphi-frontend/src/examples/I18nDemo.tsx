import React from 'react';
import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

export default () => {
    const [t, i18n] = useTranslation();

    return (
        <Space style={{ margin: '20px 15px' }}>
            <Button
                onClick={() => {
                    i18n.changeLanguage(i18n.language === 'en-US' ? 'zh-CN' : 'en-US');
                }}
            >
                切换语言
            </Button>
            <p>当前语言： {i18n.language}</p>
            <p>{t('common:button.save')}</p>
            <p>{t('name')}</p>
        </Space>
    );
};
