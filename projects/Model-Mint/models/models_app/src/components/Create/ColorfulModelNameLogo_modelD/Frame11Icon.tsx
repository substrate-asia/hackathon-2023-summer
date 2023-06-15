import { memo, SVGProps } from 'react';

const Frame11Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 19 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M11.715 14.2388L4.04284 6.44741C3.42675 5.82176 3.71863 4.76344 4.56822 4.54243L13.2366 2.28752C14.0862 2.06652 14.8563 2.84859 14.6228 3.69524L11.715 14.2388Z'
      fill='#AC91B9'
    />
    <path
      d='M5.74881 8.25701L16.308 5.42616C17.156 5.19884 17.9319 5.97515 17.7047 6.82352L15.3865 15.4796C15.1593 16.3279 14.0994 16.6121 13.4787 15.991L5.74881 8.25701Z'
      fill='#AC91B9'
    />
    <path
      d='M13.9187 6.15846L3.33026 8.87778C2.48 9.09614 2.18484 10.1535 2.79898 10.7811L9.06514 17.1842C9.67928 17.8118 10.7421 17.5388 10.9782 16.6929L13.9187 6.15846Z'
      fill='#AC91B9'
    />
    <path d='M11.7482 14.0679L5.83002 8.35891L14.1059 6.27468L11.7482 14.0679Z' fill='url(#paint0_linear_303_3993)' />
    <defs>
      <linearGradient
        id='paint0_linear_303_3993'
        x1={5.87813}
        y1={8.40422}
        x2={13.4041}
        y2={11.2534}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#272727' />
        <stop offset={1} stopColor='#B991B2' />
      </linearGradient>
    </defs>
  </svg>
);

const Memo = memo(Frame11Icon);
export { Memo as Frame11Icon };
