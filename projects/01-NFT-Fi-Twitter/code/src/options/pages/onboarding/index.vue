<script setup lang="ts">
const emit = defineEmits(['setTitle'])
emit('setTitle', 'On Board to Web3')
</script>

<template>
  <div text-white>
    <p text-xl text-center>
      Buidlers.Space Wallet is an all-in-one RWA wallet to connect you with Web3.
    </p>
    <div p-10>
      <router-link to="/options/onboarding/create-password" class="flex font-semibold bg-indigo-500 rounded-2xl shadow-sm text-sm text-white w-full p-3 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        Create a new wallet
      </router-link>
      <br>
      <br>
      <router-link to="/options/onboarding/import-wallet" class="border flex font-semibold border-indigo-500 rounded-2xl shadow-sm text-sm w-full p-3 text-indigo-500 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        Import an existing wallet
      </router-link>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
