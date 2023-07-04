import { Link, styled, Box, Typography } from '@mui/material'
import React, { ReactNode } from 'react'

const Root = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  flexBasis: '50%',
  backgroundColor: '#fff',
}))

const Header = styled('div')(() => ({
  border: 'solid 1px#e9ecef',
  borderRadius: '8px 8px 0 0',
  padding: '1rem',
}))

const Body = styled('div')(() => ({
  'padding': '1rem',
  'borderLeft': 'solid 1px#e9ecef',
  'borderRight': 'solid 1px#e9ecef',
  '>div': {
    borderBottom: 'solid 1px#e9ecef',
    height: '75px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  '>div:last-child': {
    border: 'unset',
  },
}))

const Footer = styled(Link)(() => ({
  border: 'solid 1px#e9ecef',
  borderRadius: '0 0 8px 8px',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
}))

const Icon = styled('div')(({ theme }) => ({
  width: '48px',
  height: '48px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgb(248,249,250)',
  borderRadius: '5px',
  color: theme.palette.primary.light,
  fontSize: '16px',
}))

const RouteLink = styled(Link)(() => ({
  fontSize: '16px',
  //   cursor: 'pointer',
}))

const Time = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.primary.light,
}))

const Form = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.primary.dark,
}))

const InfoBox = ({ head, foot, children }: { head: string; foot: string; children: ReactNode }) => {
  return (
    <Root>
      <Header>{head}</Header>
      <Body>{children}</Body>
      <Footer>{foot}</Footer>
    </Root>
  )
}

export const LatestTransaction = () => {
  const data = [
    {
      txHash: '#0x1cb9c569d3f9682a685ef32371b6cfea2a738b516',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
    {
      txHash: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
    {
      txHash: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
    {
      txHash: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
    {
      txHash: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
    {
      txHash: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      form: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      to: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
    },
  ]
  return (
    <InfoBox head="最新交易" foot="查看所有交易">
      {data.map(item => (
        <div key={item.txHash}>
          <Box display="flex" gap={'1rem'}>
            <Icon>Tx</Icon>
            <Box display="flex" flexDirection={'column'} justifyContent="space-between">
              <RouteLink>{`${item.txHash.slice(0, 7)}...${item.txHash.slice(-7)}`}</RouteLink>
              <Time>8 分钟前</Time>
            </Box>
          </Box>
          <Box display="flex" flexDirection={'column'} justifyContent="space-between">
            <Box display="flex" alignItems={'center'} gap="0.5rem">
              <Form>发送账户 </Form>
              <RouteLink>{`${item.form.slice(0, 7)}...${item.form.slice(-7)}`}</RouteLink>
            </Box>
            <Box display="flex" alignItems={'center'} gap="0.5rem">
              <Form>接收账户 </Form>
              <RouteLink>{`${item.to.slice(0, 7)}...${item.to.slice(-7)}`}</RouteLink>
            </Box>
          </Box>
        </div>
      ))}
    </InfoBox>
  )
}

export const LatestBlocks = () => {
  const data = [
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
    {
      txHash: '# 3,123,456',
      Recipient: '0x1cb9c569d3f9682a685ef32371b6cfea2a738b51',
      txs: '159 txns',
    },
  ]
  return (
    <InfoBox head="最新区块" foot="查看所有区块">
      {data.map(item => (
        <div key={item.txHash}>
          <Box display="flex" gap={'1rem'}>
            <Icon>Bk</Icon>
            <Box display="flex" flexDirection={'column'} justifyContent="space-between">
              <RouteLink>{item.txHash}</RouteLink>
              <Time>8 分钟前</Time>
            </Box>
          </Box>
          <Box display="flex" flexDirection={'column'} justifyContent="space-between">
            <Box display="flex" alignItems={'center'} gap="0.5rem">
              <Form>Fee Recipient </Form>
              <RouteLink>{`${item.Recipient.slice(0, 7)}...${item.Recipient.slice(-7)}`}</RouteLink>
            </Box>
            <Box display="flex" alignItems={'center'} gap="0.5rem">
              <RouteLink>{item.txs}</RouteLink>
            </Box>
          </Box>
        </div>
      ))}
    </InfoBox>
  )
}

export default InfoBox
