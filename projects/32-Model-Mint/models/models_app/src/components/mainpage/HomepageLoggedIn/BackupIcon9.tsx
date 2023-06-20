import { memo, SVGProps } from 'react';

const BackupIcon9 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <mask
      id='mask0_646_7537'
      style={{
        maskType: 'alpha',
      }}
      maskUnits='userSpaceOnUse'
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <rect width={24} height={24} fill='white' />
    </mask>
    <g mask='url(#mask0_646_7537)'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.60007 5.28117V20.4012L6.96007 17.0412H8.90544V15.3612H6.26707L5.28007 16.3482V5.28117H18.7201V15.3612H12.7422V11.1233L14.157 12.4938L15.3948 11.2559L11.858 7.71906L8.32116 11.2559L9.55906 12.4938L10.9738 11.1233V15.677C10.9738 15.799 10.9847 15.9166 11.0065 16.0298H11.0275V17.0412H18.7201C19.1821 17.0412 19.5776 16.8767 19.9066 16.5477C20.2356 16.2187 20.4001 15.8232 20.4001 15.3612V5.28117C20.4001 4.81917 20.2356 4.42367 19.9066 4.09467C19.5776 3.76567 19.1821 3.60117 18.7201 3.60117H5.28007C4.81807 3.60117 4.42257 3.76567 4.09357 4.09467C3.76457 4.42367 3.60007 4.81917 3.60007 5.28117Z'
        fill='white'
      />
    </g>
  </svg>
);

const Memo = memo(BackupIcon9);
export { Memo as BackupIcon9 };
