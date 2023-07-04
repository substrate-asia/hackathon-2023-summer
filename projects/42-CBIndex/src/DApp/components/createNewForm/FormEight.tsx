import { Button } from 'antd'
import React, { useEffect } from 'react'
const FormEight = () => {
  return (
    <div style={{ width: '100%' }}>
      <div className="text-3xl font-bold text-white">Review</div>
      <div>
        <div className="text-zinc-400">
          Please review the vault configuration carefully before creating.
        </div>
        <div className="text-white">
          All configuration settings are permanent (except where indicated).
        </div>
      </div>
      <div className="text-2xl font-bold text-white">Vault Basics</div>
      <section className="mb-4 rounded-lg bg-neutral-800 text-zinc-400">
        <div className="space-y-4">
          <div className="flex flex-col font-normal">
            <div className="flex justify-between border-b border-neutral-500 p-6">
              <div>Vault Name</div>
              <div>Vault Name</div>
            </div>
            <div className="flex justify-between border-b border-neutral-500 p-6">
              <div>Vault Symbol</div>
              <div>ENZF</div>
            </div>
            <div className="flex justify-between border-b p-6">
              <div>Denomination Asset</div>
              <div>DAI</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default FormEight
