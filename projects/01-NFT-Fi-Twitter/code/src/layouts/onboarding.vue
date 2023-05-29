<script setup lang="ts">
const title = ref('On Board to Web3')
const setTitle = _title => title.value = _title
</script>

<template>
  <div class="flex flex-col min-h-full flex-1 py-12 px-6 justify-center lg:px-8">
    <OnboardingHeader :title="title" />

    <div class="mt-10 sm:mx-auto sm:max-w-lg sm:w-full">
      <RouterView @setTitle="setTitle" />
    </div>
  </div>
</template>
