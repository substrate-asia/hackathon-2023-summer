import { memo, SVGProps } from 'react';

const SendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 31 31' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <mask
      id='mask0_588_6535'
      style={{
        maskType: 'alpha',
      }}
      maskUnits='userSpaceOnUse'
      x={0}
      y={0}
      width={31}
      height={31}
    >
      <rect y={0.28} width={30.72} height={30.72} fill='#D9D9D9' />
    </mask>
    <g mask='url(#mask0_588_6535)'>
      <path
        d='M5.632 24.513C5.20533 24.6837 4.8 24.6464 4.416 24.401C4.032 24.1557 3.84 23.7984 3.84 23.329V18.561C3.84 18.2624 3.92533 17.9957 4.096 17.761C4.26667 17.5264 4.50133 17.377 4.8 17.313L14.08 15.009L4.8 12.705C4.50133 12.641 4.26667 12.4917 4.096 12.257C3.92533 12.0224 3.84 11.7557 3.84 11.457V6.68903C3.84 6.21969 4.032 5.86236 4.416 5.61703C4.8 5.37169 5.20533 5.33436 5.632 5.50503L25.344 13.825C25.8773 14.0597 26.144 14.4544 26.144 15.009C26.144 15.5637 25.8773 15.9584 25.344 16.193L5.632 24.513Z'
        fill='#347087'
      />
    </g>
  </svg>
);

const Memo = memo(SendIcon);
export { Memo as SendIcon };
