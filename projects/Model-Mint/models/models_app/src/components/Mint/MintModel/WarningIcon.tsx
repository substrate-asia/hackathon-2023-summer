import { memo, SVGProps } from 'react';

const WarningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g opacity={0.4}>
      <mask
        id='mask0_588_6517'
        style={{
          maskType: 'alpha',
        }}
        maskUnits='userSpaceOnUse'
        x={0}
        y={0}
        width={22}
        height={22}
      >
        <rect width={21.5} height={21.5} fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_588_6517)'>
        <path
          d='M2 18.25L11 3.25L20 18.25H2ZM11 15.8816C11.2318 15.8816 11.4261 15.8059 11.583 15.6546C11.7398 15.5033 11.8182 15.3158 11.8182 15.0921C11.8182 14.8684 11.7398 14.6809 11.583 14.5296C11.4261 14.3783 11.2318 14.3026 11 14.3026C10.7682 14.3026 10.5739 14.3783 10.417 14.5296C10.2602 14.6809 10.1818 14.8684 10.1818 15.0921C10.1818 15.3158 10.2602 15.5033 10.417 15.6546C10.5739 15.8059 10.7682 15.8816 11 15.8816ZM10.1818 13.5132H11.8182V9.56579H10.1818V13.5132Z'
          fill='#D7997A'
        />
      </g>
    </g>
  </svg>
);

const Memo = memo(WarningIcon);
export { Memo as WarningIcon };
