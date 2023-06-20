import { memo, SVGProps } from 'react';

const Frame10Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M5.08333 14.8333C6.02841 10.0014 2.16667 6.66667 1.67032 6.21549C1.11962 6.97453 0.513858 9.57694 1.61525 11.5287C2.71665 13.4806 3.43125 14.0743 5.08333 14.8333Z'
      fill='#BEBEBE'
    />
    <path
      d='M14.4044 10.4426C9.16667 9.58333 6.83333 13.0833 5.99094 15.3275C6.83765 15.773 9.56327 16.0137 11.3923 14.6335C13.2214 13.2533 13.8624 12.2071 14.4044 10.4426Z'
      fill='#BEBEBE'
    />
    <path
      d='M7.81674 9.21238C4.46071 8.46224 3.04057 5.6639 2.75 4.35849C3.34929 3.47597 6.34575 1.15933 9.88702 2.31764C12.8769 3.2956 14.1002 5.90291 14.3 6.89575C13.5373 7.98052 11.1728 9.96253 7.81674 9.21238Z'
      fill='#BEBEBE'
    />
  </svg>
);

const Memo = memo(Frame10Icon);
export { Memo as Frame10Icon };


