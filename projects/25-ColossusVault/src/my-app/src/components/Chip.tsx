import { HTMLProps } from 'react'

export type ChipProps = Omit<HTMLProps<HTMLDivElement>, 'size'> & {
  color?: 'green' | 'blue' | 'default'
  size?: 'small' | 'large'
}

export default function Chip({
  className,
  color = 'default',
  size = 'large',
  ...props
}: ChipProps) {
  return <div className={`chip ${color} ${size} ${className}`} {...props} />
}
