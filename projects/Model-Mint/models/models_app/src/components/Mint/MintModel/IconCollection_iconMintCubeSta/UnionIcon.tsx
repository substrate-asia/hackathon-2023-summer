import { memo, SVGProps } from 'react';

const UnionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M8.96049 0L17.2072 4.51984L8.96049 9.03969L0.713756 4.51984L8.96049 0ZM8.16744 10.4664L0 5.94658V14.7484L8.16744 19.1889V10.4664ZM9.83256 10.4664L18 5.94658V14.7484L9.83256 19.1889V10.4664Z'
      fill='black'
    />
  </svg>
);

const Memo = memo(UnionIcon);
export { Memo as UnionIcon };
