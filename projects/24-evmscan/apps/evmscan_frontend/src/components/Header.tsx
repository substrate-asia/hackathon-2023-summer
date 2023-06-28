import { styled } from '@mui/material/styles'
import { Box, Link, Typography } from '@mui/material'
import LogoImg from '../../public/evmscan.png'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import { useTranslations } from 'next-intl'

const Root = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'column',
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
  padding: '0 24px',
  margin: '0 auto',
}))

const Logo = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
}))

const Nav = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
}))

const InfoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.primary,
}))

const InfoContent = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '32px',
  color: theme.palette.primary.main,
}))

const Border = styled('div')(() => ({
  width: '1px',
  height: '1.5rem',
  background: 'rgba(0, 0, 0, 0.87)',
  margin: '0 1rem',
}))

const Header = () => {
  const { locale } = useParams()
  const t = useTranslations('')
  const pathname = usePathname()

  return (
    <>
      <Root>
        <Head>
          <Logo href={`/${locale}`}>
            <Image src={LogoImg} alt="evmscan" width={30} height={30} />
            <Typography fontWeight="700" fontSize="2rem" color="text.primary">
              EvmScan
            </Typography>
          </Logo>
          <Nav>
            <Link href={`/${locale}`}>
              <Typography fontSize="1.5rem" color="text.primary">
                {t('home')}
              </Typography>
            </Link>
            <Link href={`/${locale}`}>
              <Typography fontSize="1.5rem" color="text.primary">
                {t('Blocks')}
              </Typography>
            </Link>
            <Link href={`/${locale}`}>
              <Typography fontSize="1.5rem" color="text.primary">
                {t('Transactions')}
              </Typography>
            </Link>
            <Box display={'flex'} alignItems="center">
              <Link href={`/zh${pathname.replace('/zh', '')}`}>
                <Typography fontSize="1.5rem" color={locale === 'zh' ? 'primary.main' : 'text.primary'}>
                  简
                </Typography>
              </Link>
              <Border />
              <Link href={pathname.replace('/zh', '/en')}>
                <Typography fontSize="1.5rem" color={locale === 'en' ? 'primary.main' : 'text.primary'}>
                  EN
                </Typography>
              </Link>
            </Box>
          </Nav>
        </Head>
      </Root>
      <Box width="100vw" bgcolor={'#f1f6ff'}>
        <Box width="100%" maxWidth="1200px" marginLeft="auto" marginRight="auto">
          <SearchBar />
        </Box>
        <Box
          width="100%"
          maxWidth="1200px"
          display="grid"
          gridTemplateColumns="1fr 1fr 1fr"
          rowGap="10px"
          marginLeft="auto"
          marginRight="auto"
          padding="20px 24px"
        >
          <Box display="flex" flexDirection="column">
            <InfoTitle>{t('Blocks')}</InfoTitle>
            <InfoContent>3,216,720</InfoContent>
          </Box>
          <Box display="flex" flexDirection="column">
            <InfoTitle>{t('Avg Block Time')}</InfoTitle>
            <InfoContent>8.02 s</InfoContent>
          </Box>
          <Box display="flex" flexDirection="column">
            <InfoTitle>{t('Transactions')}</InfoTitle>
            <InfoContent>2,580,734</InfoContent>
          </Box>
          <Box display="flex" flexDirection="column">
            <InfoTitle>{t('TPS')}</InfoTitle>
            <InfoContent>0 Txs/s</InfoContent>
          </Box>
          <Box display="flex" flexDirection="column">
            <InfoTitle>{t('Account Count')}</InfoTitle>
            <InfoContent>137,508</InfoContent>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Header
