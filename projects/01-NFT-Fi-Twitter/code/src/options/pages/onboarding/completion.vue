<script setup lang="ts">
const emit = defineEmits(['setTitle'])
emit('setTitle', 'Wallet creation successful')

const router = useRouter()
const doSubmit = async () => {
  router.push('/options/')
}
</script>

<template>
  <div class="space-y-6 text-white">
    <div text-lg text-center>
      <openmoji-sparkler w-30 h-30 mx-auto mb-10 />
      You’ve successfully protected your wallet. Keep your Secret Recovery Phrase safe and secret -- it’s your responsibility!
    </div>
    <div text-lg>
      <h2 font-bold>
        Remember:
      </h2>
      <ul list-circle-inside list-disc>
        <li>Buidlers.Space can’t recover your Secret Recovery Phrase.</li>
        <li>
          Buidlers.Space will never ask you for your Secret Recovery Phrase.
        </li>
        <li>
          Never share your Secret Recovery Phrase with anyone or risk your funds being stolen
        </li>
      </ul>
    </div>
    <div>
      <button class="rounded-md flex  font-semibold  bg-indigo-500 shadow-sm  mt-10 text-sm w-full py-1.5 px-3  leading-6 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 " @click="doSubmit">
        Got it!
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
