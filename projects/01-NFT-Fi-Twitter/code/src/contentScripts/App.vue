<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'

const [show, toggle] = useToggle(false)
</script>

<template>
  <div class="flex font-sans m-5 right-0 bottom-0 leading-1em z-100 fixed items-end select-none">
    <Web3Inject />
    <div
      class="bg-white rounded-lg h-min shadow w-max text-gray-800"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      <h1 class="text-lg">
        Vitesse WebExt
      </h1>
      <SharedSubtitle />
    </div>
    <button
      class="border-none rounded-full cursor-pointer flex h-10 shadow w-10"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
      <pixelarticons-power class="m-auto text-white text-lg block" />
    </button>
  </div>
</template>
