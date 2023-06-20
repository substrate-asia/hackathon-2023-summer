import { memo, SVGProps } from 'react';

const Emoji_flagsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <g opacity={0.7}>
      <mask
        id='mask0_303_4002'
        style={{
          maskType: 'alpha',
        }}
        maskUnits='userSpaceOnUse'
        x={0}
        y={0}
        width={24}
        height={25}
      >
        <rect y={0.5} width={24} height={24} fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_303_4002)'>
        <path
          d='M6 21.5C5.71667 21.5 5.47917 21.4042 5.2875 21.2125C5.09583 21.0208 5 20.7833 5 20.5V5.5C5 5.21667 5.09583 4.97917 5.2875 4.7875C5.47917 4.59583 5.71667 4.5 6 4.5H13.175C13.4083 4.5 13.6167 4.575 13.8 4.725C13.9833 4.875 14.1 5.06667 14.15 5.3L14.4 6.5H19C19.2833 6.5 19.5208 6.59583 19.7125 6.7875C19.9042 6.97917 20 7.21667 20 7.5V15.5C20 15.7833 19.9042 16.0208 19.7125 16.2125C19.5208 16.4042 19.2833 16.5 19 16.5H13.825C13.5917 16.5 13.3833 16.425 13.2 16.275C13.0167 16.125 12.9 15.9333 12.85 15.7L12.6 14.5H7V20.5C7 20.7833 6.90417 21.0208 6.7125 21.2125C6.52083 21.4042 6.28333 21.5 6 21.5Z'
          fill='black'
        />
      </g>
    </g>
  </svg>
);

const Memo = memo(Emoji_flagsIcon);
export { Memo as Emoji_flagsIcon };
