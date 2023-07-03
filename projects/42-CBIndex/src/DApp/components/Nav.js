import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '~/lib/theme'
import Connect from './Connect'
import { Popover, Button } from 'antd'
import { BellFilled } from '@ant-design/icons'
import { getNotificationListApi } from '../data/api/AllApi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import logo from '~/public/images/logo.png'
// import Image from 'next/image'
function formatString(input) {
  if (input.length <= 6) {
    return input
  }
  const front = input.slice(0, 5)
  const back = input.slice(-5)
  return `${front}...${back}`
}
const Nav = ({ ConnectKitButton }) => {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [data, setData] = useState([])
  const [detail, setDetail] = useState([])
  const handleMouseEnter = () => {
    getNotificationListApi(localStorage.getItem('address')).then((res) => {
      setData(res.data.list)
    })
  }
  useEffect(() => {
    let a = []
    for (let i = 0; i < data.length; i++) {
      data[i].vaultActivity.detail = JSON.parse(
        atob(data[i].vaultActivity.detail)
      )
      a.push(data[i])
    }
    setDetail(a)
  }, [data])
  const content = (
    <>
      <div>
        {detail.map((it) => {
          return (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // console.log(it.followerAddress)
                router.push({
                  pathname: '/portfolio',
                  query: {
                    address: it.followerAddress,
                  },
                })
              }}
            >
              {formatString(it.followerAddress) +
                'Conducted' +
                it.vaultActivity.operation +
                'Amount:' +
                it.vaultActivity.detail.amount}
            </div>
          )
        })}
      </div>
    </>
  )
  return (
    <nav
      // style={{ position: 'relative' }}
      className="w-full p-4 border-b border-gray-800 bg-zinc-950"
    >
      {/* <Link href="/">
        <div className={classes.logoCenter}>
          <Image src="/images/logo.png" alt="Logo" width={35} height={35} />
          <div>
            <span className={classes.logo_text}>InCre</span>
            <span className={classes.beta_marker}>BETA</span>
          </div>
        </div>
      </Link> */}

      <div className="flex justify-between">
        <Link href="/discover/CopyInvesting">
          <div className="flex items-center cursor-pointer">
            <div className="flex mr-2">
              <Image src={logo} width={36} height={36} />
            </div>
            <div className="flex align-top">
              <span className="text-2xl font-semibold text-white">
                CBIndex DApp
              </span>
              <span className="px-2 text-xs text-white">DEMO</span>
            </div>
          </div>
        </Link>
        <div className="flex">
          <Popover
            placement="bottom"
            onMouseEnter={handleMouseEnter}
            content={content}
            // arrow={mergedArrow}
          >
            <BellFilled
              style={{ color: '#999', cursor: 'pointer', padding: '0 10px' }}
            />
          </Popover>
          <ConnectKitButton />
        </div>

        {/* <Connect /> */}
      </div>
    </nav>
  )
}

export default Nav
