import React, { useEffect, useState } from 'react'
import { Input, Select } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import MyTag from '../Label/MyTag'
const nameError = (
  <div style={{ color: 'red' }}>
    String must contain at least 3 character(s)
  </div>
)
const symbolError = (
  <div style={{ color: 'red' }}>
    String must contain at least 3 character(s)
  </div>
)
const nameSuccess = 'The name of your vault.'
const symbolSuccess =
  'The symbol is the token ticker associated with the tokenized shares of your vault.'
const SlectAsset =
  "The denomination asset is the asset in which depositors deposit into your vault and in which the vault's share price and the performance are measured."
const FormTwo = (props: any) => {
  const { getNameSymbolFuc, name, symbol } = props
  const [nameStatus, setNameStatus] = useState(false)
  const [symbolStatus, setSymbolStatus] = useState(false)
  const [nameText, setNameText] = useState('')
  const [symbolText, setSymbolText] = useState('')
  const nameChangeEvt = (e: any) => {
    getNameSymbolFuc(e.target.value, symbolText)
    setNameText(e.target.value)
    if (e.target.value.length >= 3) {
      setNameStatus(true)
    } else {
      setNameStatus(false)
    }
  }
  const symbolChangeEvt = (e: any) => {
    getNameSymbolFuc(nameText, e.target.value)
    setSymbolText(e.target.value)
    if (e.target.value.length >= 3) {
      setSymbolStatus(true)
    } else {
      setSymbolStatus(false)
    }
  }
  useEffect(
    function () {
      setNameText(name)
      if (name.length >= 3) {
        setNameStatus(true)
      } else {
        setNameStatus(false)
      }
    },
    [name]
  )
  useEffect(
    function () {
      setSymbolText(symbol)
      if (symbol.length >= 3) {
        setSymbolStatus(true)
      } else {
        setSymbolStatus(false)
      }
    },
    [symbol]
  )
  return (
    <>
      <div className="w-auto text-white">
        <h1 className="text-2xl font-bold">Basics</h1>
        <div className="w-auto">
          <div className="text-zinc-400">Name</div>
          <Input
            onChange={nameChangeEvt}
            value={name}
            status={!nameStatus ? 'error' : ''}
            style={{ width: '100%' }}
            suffix={
              !nameStatus && (
                <ExclamationCircleFilled style={{ color: 'red' }} />
              )
            }
          />
          {nameStatus ? nameSuccess : nameError}
        </div>
        <div className="w-auto">
          <div className="text-zinc-400">Symbol</div>
          <Input
            style={{ width: '100%' }}
            value={symbol}
            onChange={symbolChangeEvt}
            status={!symbolStatus ? 'error' : ''}
            suffix={
              !symbolStatus && (
                <ExclamationCircleFilled style={{ color: 'red' }} />
              )
            }
          />
          {symbolStatus ? symbolSuccess : symbolError}
        </div>
        <div className="flex">
          <div className="flex">
            <div>Denomination Asset</div>
            <MyTag color="warning" text="Semi-permanent Settin" />
          </div>
        </div>
        <Select
          defaultValue="lucy"
          style={{ width: '100%' }}
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
          ]}
        />
        <span className="text-zinc-400">{SlectAsset}</span>
      </div>
    </>
  )
}
export default FormTwo
