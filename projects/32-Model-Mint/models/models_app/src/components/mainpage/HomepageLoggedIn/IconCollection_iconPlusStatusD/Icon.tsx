import { memo, SVGProps } from 'react';

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M13 8.55H8.65V13H4.6V8.55H0.25V4.725H4.6V0.25H8.65V4.725H13V8.55Z' fill='black' />
  </svg>
);

const Memo = memo(Icon);
export { Memo as Icon };
