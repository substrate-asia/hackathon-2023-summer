<script setup lang="ts">
import { storageDemo } from '~/logic/storage'
</script>

<template>
  <main class="text-center py-10 px-4 text-gray-700 dark:text-gray-200">
    <img src="/assets/icon.svg" class="mx-2 text-2xl icon-btn" alt="extension icon">
    <div>Options</div>
    <SharedSubtitle />

    <input v-model="storageDemo" class="border rounded border-gray-400 mt-2 py-1 px-2">

    <div class="mt-4">
      Powered by Vite <pixelarticons-zap class="align-middle inline-block" />
    </div>
    <h1>Hello App!</h1>
    <p>
      <!-- use the router-link component for navigation. -->
      <!-- specify the link by passing the `to` prop. -->
      <!-- `<router-link>` will render an `<a>` tag with the correct `href` attribute -->
      <router-link to="/options">
        Go to Home
      </router-link>
      <router-link to="/options/about">
        Go to About
      </router-link>
    </p>
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div bg-red>
      <router-view />
    </div>
  </main>
</template>
