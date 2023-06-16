import { memo, SVGProps } from 'react';

const Auto_read_playIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <mask
      id='mask0_487_6463'
      style={{
        maskType: 'alpha',
      }}
      maskUnits='userSpaceOnUse'
      x={0}
      y={0}
      width={25}
      height={25}
    >
      <rect x={0.251877} y={0.0732422} width={24} height={24} fill='#D9D9D9' />
    </mask>
    <g mask='url(#mask0_487_6463)'>
      <path
        d='M12.0725 14.6176L15.1125 12.5376C15.3975 12.3441 15.54 12.0781 15.54 11.7395C15.54 11.4009 15.3975 11.1348 15.1125 10.9413L12.0725 8.86135C11.7558 8.63562 11.4313 8.61949 11.0988 8.81298C10.7663 9.00647 10.6 9.2967 10.6 9.68367V13.7953C10.6 14.1822 10.7663 14.4725 11.0988 14.666C11.4313 14.8594 11.7558 14.8433 12.0725 14.6176ZM4.615 21.704C4.31417 22.0104 3.96979 22.0789 3.58188 21.9096C3.19396 21.7403 3 21.438 3 21.0026V5.93487C3 5.40278 3.18604 4.94728 3.55813 4.56837C3.93021 4.18946 4.3775 4 4.9 4H20.1C20.6225 4 21.0698 4.18946 21.4419 4.56837C21.814 4.94728 22 5.40278 22 5.93487V17.5441C22 18.0762 21.814 18.5317 21.4419 18.9106C21.0698 19.2895 20.6225 19.4789 20.1 19.4789H6.8L4.615 21.704Z'
        fill='black'
      />
    </g>
  </svg>
);

const Memo = memo(Auto_read_playIcon);
export { Memo as Auto_read_playIcon };
