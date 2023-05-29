<script setup lang="ts">
interface Props {
  modelValue: string
  foo?: string
}
const {
  modelValue,
  foo = 'default-val',
} = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div text-white>
    <p text-xl text-center>
      Buidlers.Space Wallet is an all-in-one RWA wallet to connect you with Web3.
    </p>
    <div p-10>
      <a href="/options/onboarding/create-password" class="flex font-semibold bg-indigo-500 rounded-2xl shadow-sm text-sm text-white w-full p-3 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        Create a new wallet
      </a>
      <br>
      <br>
      <a class="border flex font-semibold border-indigo-500 rounded-2xl shadow-sm text-sm w-full p-3 text-indigo-500 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        Import an existing wallet
      </a>
    </div>
  </div>
</template>
