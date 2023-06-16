import { memo, SVGProps } from 'react';

const UnionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 1267 524' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M0 8.00001C0 3.58173 3.58172 0 8 0H1259C1263.42 0 1267 3.58172 1267 8V516C1267 520.418 1263.42 524 1259 524H8.00004C3.58176 524 0 520.418 0 516V8.00001Z'
      fill='white'
      fillOpacity={0.02}
    />
    <path
      d='M8 0.5H1259V-0.5H8V0.5ZM1266.5 8V516H1267.5V8H1266.5ZM1259 523.5H8.00004V524.5H1259V523.5ZM0.5 516V8.00001H-0.5V516H0.5ZM8.00004 523.5C3.8579 523.5 0.5 520.142 0.5 516H-0.5C-0.5 520.694 3.30562 524.5 8.00004 524.5V523.5ZM1266.5 516C1266.5 520.142 1263.14 523.5 1259 523.5V524.5C1263.69 524.5 1267.5 520.694 1267.5 516H1266.5ZM1259 0.5C1263.14 0.5 1266.5 3.85787 1266.5 8H1267.5C1267.5 3.30558 1263.69 -0.5 1259 -0.5V0.5ZM8 -0.5C3.30558 -0.5 -0.5 3.30559 -0.5 8.00001H0.5C0.5 3.85787 3.85787 0.5 8 0.5V-0.5Z'
      fill='url(#paint0_linear_487_6438)'
      fillOpacity={0.1}
    />
    <defs>
      <linearGradient
        id='paint0_linear_487_6438'
        x1={633.5}
        y1={0}
        x2={633.5}
        y2={914.213}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='white' />
        <stop offset={1} stopColor='white' stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

const Memo = memo(UnionIcon);
export { Memo as UnionIcon };
