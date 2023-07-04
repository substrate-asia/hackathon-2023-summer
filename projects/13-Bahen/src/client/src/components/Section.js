import React from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

function Section({ title, children }) {
  return (
    <div
      style={{ borderRadius: 24, backgroundColor: '#1B1B1B', marginBottom: 20 }}
    >
      <Title
        level={3}
        style={{
          borderRadius: 24,
          backgroundColor: '#242424',
          height: '63px',
          lineHeight: '63px',
          padding: '0 24px',
          marginBottom: 0,
          color: '#fff',
        }}
      >
        {title}
      </Title>
      <div
        style={{
          padding: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Section;
