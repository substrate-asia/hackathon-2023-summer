'use client'

import { Box } from '@mui/material'
import { LatestBlocks, LatestTransaction } from 'src/components/InfoBox'

export default async function Home() {
  return (
    <Box display="flex" justifyContent={'space-between'} gap="1rem" pt="2rem">
      <LatestBlocks />
      <LatestTransaction />
    </Box>
  )
}
