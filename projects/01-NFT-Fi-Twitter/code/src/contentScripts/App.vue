<script setup lang="ts">
import '../styles'

const show = ref(false)
</script>

<template>
  <div class="flex font-sans top-0 right-0 leading-1em z-100 fixed items-end select-none">
    <div
      v-show="show"
      class="bg-white rounded-lg h-min shadow w-max text-gray-800"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
    >
      <ContentList />
    </div>

    <button
      v-show="!show"
      class="border-none rounded-full cursor-pointer flex h-10 shadow w-10"
      bg="teal-600 hover:teal-700"
      @click="show = true"
    >
      <pixelarticons-power class="m-auto text-white text-lg block" />
    </button>
  </div>
</template>
