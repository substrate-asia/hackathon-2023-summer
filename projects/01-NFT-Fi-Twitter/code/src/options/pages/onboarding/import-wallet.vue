<script setup lang="ts">
import { sendMessage } from 'webext-bridge/options'
import * as passworder from '@metamask/browser-passworder'
import { encryptedMnemonic } from '~/logic/storage'

const emit = defineEmits(['setTitle'])
emit('setTitle', 'Access your wallet with your Secret Recovery Phrase')

const lenArr = [12, 15, 18, 21, 24]
const phraseLen = ref(12)
const mnemonicArr = ref(new Array(phraseLen.value))
const isShow = ref(mnemonicArr.value.map(() => false))
const mnemonicStr = computed(() => mnemonicArr.value.join(' '))
const password = ref('')
const theIndex = ref(0)
const isValid = computed(() => {
  const hasEmpty = some(mnemonicArr.value, (item, index) => {
    theIndex.value = index
    return item === '' || item === undefined
  })
  return !hasEmpty
})

watch(phraseLen, () => {
  mnemonicArr.value = new Array(phraseLen.value)
  isShow.value = mnemonicArr.value.map(() => false)
})
onMounted(async () => {
  const rz = await sendMessage('getStoreInMemory', { keys: ['password'] }, 'background')
  password.value = rz.password
})

const router = useRouter()
const doSubmit = async () => {
  const secrets = { mnemonic: mnemonicStr.value }
  encryptedMnemonic.value = await passworder.encrypt(password.value, secrets)
  router.push('/options/onboarding/completion')
}

const onPaste = (evt) => {
  const pasteTextArr = evt.clipboardData.getData('text/plain').split(' ')
  pasteTextArr.map((item, index) => {
    mnemonicArr.value[index] = item
  })
}
</script>

<template>
  <div class="space-y-6 text-white">
    <div text-lg text-center>
      We cannot recover your password. We will use your Secret Recovery Phrase to validate your ownership and restore your wallet. Enter the Secret Recovery Phrase that you were given when you created your wallet.
    </div>
    <div class="sm:col-span-3">
      <label for="length-select" class="font-medium text-sm text-white leading-6 block">Type your Secret Recovery Phrase</label>
      <div class="mt-2">
        <select id="length-select" v-model="phraseLen" name="length-select" autocomplete="length-select" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-3 px-2 ring-1 ring-white/10 block [&_*]:text-black sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
          <option v-for="len in lenArr" :key="len" :value="len">
            I have a {{ len }}-word phrase
          </option>
        </select>
      </div>
    </div>
    <div flex rounded-md text-blue-400 border-blue-400 border-1 py-3 items-center>
      <ooui-notice mx-2 />
      You can paste your entire secret recovery phrase into any field
    </div>
    <div border-1 relative rounded-lg>
      <div w-full opacity="50" px-3 py-5 text-white rounded-lg bg-black text-lg flex justify-around flex-wrap space-y-2 @paste.prevent="onPaste">
        <div v-for="(item, index) in mnemonicArr" :key="index" flex items-center>
          {{ index + 1 }}. <input v-model="mnemonicArr[index]" :type="isShow[index] ? 'text' : 'password'" w-40 bg-none border-1 border-gray-4 rounded-lg ml-2 bg-transparent py-2 text-center>
          <button type="button" class="font-semibold text-sm py-3 px-3 relative inline-flex items-center hover:opacity-80 " @click="isShow[index] = !isShow[index]">
            <ic-baseline-remove-red-eye v-if="isShow[index]" />
            <material-symbols-disabled-visible v-else />
          </button>
        </div>
      </div>
    </div>
    <div v-if="theIndex !== 0 && !isValid" flex rounded-md text-red-600 border-red-600 border-1 py-3 items-center>
      <ooui-notice mx-2 />
      Secret Recovery Phrases contain 12, 15, 18, 21, or 24 words
    </div>

    <div>
      <button class="rounded-md flex  font-semibold  bg-indigo-500 shadow-sm  mt-10 text-sm w-full py-1.5 px-3  leading-6 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 " :disabled="!isValid" @click="doSubmit">
        Confirm
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
