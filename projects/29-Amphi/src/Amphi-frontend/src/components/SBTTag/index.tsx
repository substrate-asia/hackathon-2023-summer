import React from 'react';
import { Popover } from 'antd';

export default ({ image }: any) => (
    <Popover content={<img src={image} alt='sbt' height={160} />}>
        <img src={image} alt='sbt' height={24} style={{ cursor: 'pointer' }} />
    </Popover>
);
