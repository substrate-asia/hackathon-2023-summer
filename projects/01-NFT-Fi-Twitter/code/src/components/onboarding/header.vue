<script setup lang="ts">
interface Props {
  title?: string
}
const {
  title = "On board to Web3",
} = defineProps<Props>()
</script>

<template>
  <div class="mt-1/10 sm:mx-auto sm:max-w-sm sm:w-full">
    <img class="rounded-full mx-auto h-20 w-auto" src="https://avatars.githubusercontent.com/u/109504677?v=4" alt="Web3Hacker.World">
    <h2 class="font-bold mt-10 text-center text-white tracking-tight text-2xl leading-9">
      {{ title }}
    </h2>
  </div>
</template>
