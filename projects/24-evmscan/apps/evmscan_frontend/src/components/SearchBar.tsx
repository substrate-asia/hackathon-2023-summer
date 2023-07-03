import React from 'react'
import { styled } from '@mui/material/styles'
import { InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const Search = styled(InputBase)(({ width, height }: { width: string; height: string }) => ({
  width,
  height,
  borderRadius: '16px',
  backgroundColor: '#fff',
  padding: '8px 16px',
  fontSize: '16px',
}))

const Icon = styled(SearchIcon)(() => ({
  fontSize: 'large',
  marginRight: '10px',
}))

const SearchBar = ({ width = '100%', height = '56px' }: { width?: string; height?: string }) => {
  return (
    <Search
      width={width}
      height={height}
      startAdornment={<Icon />}
      placeholder="Block Hash/Txn Hash/ETH Address/Contract Address"
    />
  )
}

export default SearchBar
