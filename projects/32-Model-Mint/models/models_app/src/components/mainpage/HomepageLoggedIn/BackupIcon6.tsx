import { memo, SVGProps } from 'react';

const BackupIcon6 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <mask
      id='mask0_646_7444'
      style={{
        maskType: 'alpha',
      }}
      maskUnits='userSpaceOnUse'
      x={0}
      y={0}
      width={20}
      height={21}
    >
      <rect y={0.5} width={20} height={20} fill='#42778D' />
    </mask>
    <g mask='url(#mask0_646_7444)'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3 4.9V17.5L5.8 14.7H7.42114V13.3H5.2225L4.4 14.1225V4.9H15.6V13.3H10.6185V9.76878L11.7975 10.9109L12.829 9.8793L9.88168 6.93193L6.93431 9.8793L7.96589 10.9109L9.14483 9.76878V13.5635C9.14483 13.6653 9.15394 13.7634 9.17215 13.8579H9.18956V14.7H15.6C15.985 14.7 16.3146 14.5629 16.5888 14.2888C16.8629 14.0146 17 13.685 17 13.3V4.9C17 4.515 16.8629 4.18542 16.5888 3.91125C16.3146 3.63708 15.985 3.5 15.6 3.5H4.4C4.015 3.5 3.68542 3.63708 3.41125 3.91125C3.13708 4.18542 3 4.515 3 4.9Z'
        fill='#42778D'
      />
    </g>
  </svg>
);

const Memo = memo(BackupIcon6);
export { Memo as BackupIcon6 };
