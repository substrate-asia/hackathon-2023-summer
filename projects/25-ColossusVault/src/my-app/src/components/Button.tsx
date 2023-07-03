import { HTMLProps, useState } from 'react'
import '../App.css'

type ButtonPropsType = Omit<
  HTMLProps<HTMLButtonElement>,
  'onClick' | 'title'
> & {
  onClick: () => Promise<void>
  title: string
  loadingText: string
  type?: 'submit' | 'button' | 'reset'
  isActive?: boolean
}

export default function Button({
  className,
  onClick,
  title,
  loadingText,
  isActive,
  ...props
}: ButtonPropsType) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return

    setLoading(true)
    try {
      await onClick()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`button ${isActive ? 'active' : ''} ${className}`}>
      {loading ? loadingText : title}
    </button>
  )
}
