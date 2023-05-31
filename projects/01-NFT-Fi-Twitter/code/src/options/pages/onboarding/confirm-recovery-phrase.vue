<script setup lang="ts">
import * as passworder from '@metamask/browser-passworder'
import { storageOnboard } from '~/logic/storage'

const emit = defineEmits(['setTitle'])
emit('setTitle', 'Confirm Secret Recovery Phrase')

const mnemonicRealStr = computed(() => storageOnboard.value.mnemonicStr)
const mnemonicRealArrWithBlank = ref([])

watch(mnemonicRealStr, () => {
  mnemonicRealArrWithBlank.value = mnemonicRealStr.value.split(' ')
  mnemonicRealArrWithBlank.value[1] = ''
  mnemonicRealArrWithBlank.value[4] = ''
  mnemonicRealArrWithBlank.value[8] = ''
})

const isValid = computed(() => mnemonicRealArrWithBlank.value.join(' ') === mnemonicRealStr.value)
const router = useRouter()
const doSubmit = async () => {
  const secrets = { mnemonic: mnemonicRealStr.value }
  const password = storageOnboard.value.password

  const blob = await passworder.encrypt(password, secrets)
  console.log('====> blob :', blob)
  // router.push('/options/onboarding/completion')
}
</script>

<template>
  <div class="space-y-6 text-white">
    <div text-lg text-center>
      Confirm Secret Recovery Phrase
    </div>
    <div border-1 relative rounded-lg>
      <div w-full h-100 opacity="50" px-3 py-5 text-white rounded-lg bg-black text-lg flex justify-around flex-wrap>
        <div v-for="(item, index) in mnemonicRealArrWithBlank" :key="index" flex items-center>
          {{ index + 1 }}. <input v-model="mnemonicRealArrWithBlank[index]" bg-none border-1 border-gray-4 rounded-3xl ml-2 bg-transparent py-2 text-center>
        </div>
      </div>
    </div>
    <div>
      <button class="rounded-md flex  font-semibold  bg-indigo-500 shadow-sm  mt-10 text-sm w-full py-1.5 px-3  leading-6 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 " :disabled="isValid" @click="doSubmit">
        Confirm
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
