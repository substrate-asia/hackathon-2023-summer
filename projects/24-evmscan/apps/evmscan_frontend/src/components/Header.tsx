import React from 'react'
import { styled } from '@mui/material/styles'
import { Link, Typography } from '@mui/material'
import LogoImg from '../../public/evmscan.png'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const Root = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  zIndex: '9999',
  backgroundColor: theme.palette.background.paper,
  width: '100%',
}))

const Head = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  height: '64px',
  padding: '0 6px',
  margin: '0 auto',
}))

const Logo = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}))

const Nav = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
}))

const Header = () => {
  const params = useParams()

  return (
    <Root>
      <Head>
        <Logo href={`/${params.locale}`}>
          <Image src={LogoImg} alt="evmscan" width={30} height={30} />
          <Typography fontWeight="700" fontSize="2rem" color="text.primary">
            EvmScan
          </Typography>
        </Logo>
        <Nav>
          <Link href={`/${params.locale}`}>
            <Typography fontSize="1.5rem" color="text.primary">
              Home
            </Typography>
          </Link>
          <Link href={`/${params.locale}`}>
            <Typography fontSize="1.5rem" color="text.primary">
              Blocks
            </Typography>
          </Link>
          <Link href={`/${params.locale}`}>
            <Typography fontSize="1.5rem" color="text.primary">
              Transactions
            </Typography>
          </Link>
        </Nav>
      </Head>
    </Root>
  )
}

export default Header
