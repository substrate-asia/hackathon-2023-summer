<script setup lang="ts">
import * as passworder from '@metamask/browser-passworder'
import { sendMessage } from 'webext-bridge/options'
import { encryptedMnemonic } from '~/logic/storage'

const password = ref('')
const hasError = ref(false)
const router = useRouter()
const doSubmit = async () => {
  try {
    const rz = await passworder.decrypt(password.value, encryptedMnemonic.value)
    await sendMessage('storeInMemory', { mnemonicStr: rz.mnemonic }, 'background')
    hasError.value = false
    router.push('/options')
  }
  catch (err) {
    if (err)
      hasError.value = true
  }
}
</script>

<template>
  <div class="flex flex-col min-h-full flex-1 py-12 px-6 justify-center lg:px-8">
    <div class="mt-1/10 sm:mx-auto sm:max-w-sm sm:w-full">
      <img class="rounded-full mx-auto h-20 w-auto" src="https://avatars.githubusercontent.com/u/109504677?v=4" alt="Web3Hacker.World">
      <h2 class="font-bold mt-10 text-center text-white tracking-tight text-2xl leading-9">
        Welcome back <br>
        Web3 RWA World
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:max-w-sm sm:w-full">
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="font-medium text-sm text-white leading-6 block">Password</label>
            <div class="text-sm">
              <router-link to="/options/onboarding/create-password?isImportWallet=yes" class="font-semibold text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </router-link>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required="" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white  w-full py-1.5 px-3 ring-1  block sm:text-sm sm:leading-6  focus:ring-1 focus:ring-indigo-500" :class="hasError ? 'text-red-900 ring-red-300' : 'ring-white/10'">
          </div>
          <p v-show="hasError" class="mt-2 text-sm text-red-600">
            Password not correct!
          </p>
        </div>
        <div>
          <button :disabled="!password" class="rounded-md flex font-semibold bg-indigo-500 shadow-sm text-sm text-white w-full py-1.5 px-3 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-40" @click="doSubmit">
            Unlock
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
