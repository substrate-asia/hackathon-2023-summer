<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { english, generateMnemonic } from 'viem/accounts'
const emit = defineEmits(['setTitle'])
emit('setTitle', 'Write down your Secret Recovery Phrase')

const mnemonicRealStr = generateMnemonic(english)
const mnemonicRealArr = mnemonicRealStr.split(' ')
const mnemonicFakeArr = generateMnemonic(english).split(' ')

const isShow = ref(false)

const { text, copy, copied, isSupported } = useClipboard({ source: mnemonicRealStr })

const router = useRouter()
const doSubmit = async () => {
  router.push('/options/onboarding/confirm-recovery-phrase')
}
</script>

<template>
  <div class="space-y-6 text-white">
    <div text-lg>
      <p text-center>
        Write down this 12-word Secret Recovery Phrase and save it in a place that you trust and only you can access.
      </p>
      <br>
      <br>
      <span text-bold>Tips:</span>
      <ul list-circle-inside list-disc>
        <li>Save in a password manager</li>
        <li>
          Store in a safe deposit box
        </li>
        <li>
          Write down and store in multiple secret places
        </li>
      </ul>
    </div>
    <div border-1 relative rounded-lg>
      <div v-if="isShow" w-full h-100 opacity="50" px-3 py-5 text-white rounded-lg bg-black text-lg flex justify-around flex-wrap>
        <div v-for="(item, index) in mnemonicRealArr" :key="index" flex items-center>
          {{ index + 1 }}. <input :value="item" bg-none border-1 border-gray-4 rounded-3xl ml-2 bg-transparent py-2 text-center>
        </div>
      </div>
      <div v-else w-full h-100 blur-sm px-3 py-5 text-white rounded-lg text-lg flex justify-around flex-wrap>
        <div v-for="(item, index) in mnemonicFakeArr" :key="index" flex items-center>
          {{ index + 1 }}. <input :value="item" bg-none border-1 rounded-3xl ml-2 bg-transparent py-2 text-center>
        </div>
      </div>
      <div v-show="!isShow" absolute px-3 py-5 top-0 left-0 w-full h-100 class="bg-black/60" text-xl flex flex-col justify="center" items-center rounded-lg>
        <ic-baseline-remove-red-eye mb-10 />
        Make sure nobody is looking
      </div>
    </div>
    <div flex justify="between" items-center text-indigo-500 text-lg>
      <button v-if="isShow" flex items-center @click="isShow = false">
        <material-symbols-disabled-visible mr-2 /> Hide Recovery Phrase
      </button>
      <button v-else flex items-center @click="isShow = true">
        <ic-baseline-remove-red-eye mr-2 /> Reveal Recovery Phrase
      </button>
      <span v-if="copied" flex items-center text-green-5>
        <material-symbols-check-circle mr-2 />
        Copied.
      </span>
      <button v-else flex items-center @click="copy(mnemonicRealStr)">
        <ion-ios-copy mr-2 />Copy to clipboard
      </button>
    </div>
    <div>
      <button class="rounded-md flex  font-semibold  bg-indigo-500 shadow-sm  mt-10 text-sm w-full py-1.5 px-3  leading-6 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 " @click="doSubmit">
        Next
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
