import React from 'react';
import type { ReactNode } from 'react';

interface IHomeSectionProps {
    className?: string;
    title: string;
    children: ReactNode;
}

export default ({ className, title, children }: IHomeSectionProps) => {
    return (
        <div className={`home-section ${className}`}>
            <h2 className='home-section-title'>{title}</h2>
            <div className='home-section-content'>{children}</div>
        </div>
    );
};
