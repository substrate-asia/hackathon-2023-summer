import { Button, Card } from 'antd'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
const carInfo = [
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
  {
    headsculpture: (
      <Image
        src={
          'https://assets.cbindex.finance/api/uploads/thumbnail/g6zffvxolh.jpg'
        }
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        alt="touxiang"
      />
    ),
    name: 'Audi',
    address: '0x26...AAfA',
    peopleNum: '10',
    roi: '10%',
    pnl: '10%',
    nav: '10',
    runtime: '10day',
  },
]
const PortfolioList = (props: any) => {
  const { selectTabsKey } = props
  const [carLoading, setCarLoading] = useState<boolean>(true)
  useEffect(() => {
    if (selectTabsKey === '2') {
      setTimeout(() => {
        setCarLoading(false)
      }, 1500)
    } else {
      setCarLoading(true)
    }
  }, [selectTabsKey])
  return (
    <>
      <div className="flex flex-wrap">
        {carInfo.map((it) => {
          return (
            <Card
              style={{
                width: 234,
                height: 254,
                marginTop: 16,
                marginLeft: 16,
              }}
              loading={carLoading}
            >
              <div>
                <div className="flex">
                  <div> {it.headsculpture}</div>
                  <div className="ml-3  flex flex-col">
                    <span className="text-xl font-bold text-zinc-100">
                      {it.name}
                    </span>
                    <span className="font-semibold text-zinc-400">
                      {it.address}
                    </span>
                  </div>
                </div>
                <div>{it.peopleNum}</div>
                <div>
                  {it.roi}
                  {it.pnl}
                </div>
                <div>
                  {it.nav} {it.runtime}
                </div>
                <Button>Copy</Button>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
export default PortfolioList
