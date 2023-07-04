import React from 'react';
import AmCard from '@/components/Card';
import lineIcon from '@/assets/svg/trans-content-line.svg';
import languageIcon from '@/components/Icon/Language';
import downloadIcon from '@/components/Icon/Download';
import IconButton from '@/components/IconButton';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './index.module.scss';

const cardStyle = {
    background: '#FFF',
    padding: '16px 24px 24px'
};
const titleStyle = {
    marginBottom: '24px'
};

const TranContent = () => {
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Al Translation`,
            children: (
                <div className={styles['sub-card-content']}>
                    <IconButton icon={languageIcon} text='Ocean.txt' />
                    <IconButton icon={downloadIcon} text='Download' />
                </div>
            )
        },
        {
            key: '2',
            label: `Human translation`,
            children: <p>The translator is working hard to translate, please wait</p>
        }
    ];
    return (
        <AmCard title='Translate Content' cardStyle={cardStyle} titleStyle={titleStyle}>
            <div className={styles['trans-content-box']}>
                <div className={styles['trans-content-sub-card']}>
                    <p className={styles['sub-card-title']}>Original Content</p>
                    <div className={styles['sub-card-content']}>
                        <IconButton icon={languageIcon} text='Ocean.txt' />
                        <IconButton icon={downloadIcon} text='Download' />
                    </div>
                </div>
                <img src={lineIcon} alt='' className={styles['trans-content-line']} />
                <div className={styles['trans-content-sub-card']}>
                    <Tabs defaultActiveKey='1' items={items} onChange={onChange} />
                </div>
            </div>
        </AmCard>
    );
};

export default TranContent;
