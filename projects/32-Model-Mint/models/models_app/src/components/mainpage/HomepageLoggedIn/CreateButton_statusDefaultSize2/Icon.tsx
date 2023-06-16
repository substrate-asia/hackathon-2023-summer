import { memo, SVGProps } from 'react';

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M13.76 9.132H9.236V13.76H5.024V9.132H0.5V5.154H5.024V0.5H9.236V5.154H13.76V9.132Z' fill='black' />
  </svg>
);

const Memo = memo(Icon);
export { Memo as Icon };
