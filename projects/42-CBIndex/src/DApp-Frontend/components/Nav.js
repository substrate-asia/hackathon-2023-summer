import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '~/lib/theme'
import Connect from './Connect'
const Nav = () => {
  const { isDarkMode } = useTheme()
  return (
    <nav className="w-full p-4 border-b bg-scale-300">
      <Connect />
    </nav>
  )
}

export default Nav
