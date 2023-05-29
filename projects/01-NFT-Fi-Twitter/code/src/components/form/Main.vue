<script setup lang="ts">
const tabs = [
  { name: 'New Content', href: '#', current: false },
  { name: 'New NFT', href: '#', current: false },
]
const currentTab = ref(tabs[0])
</script>

<template>
  <div w-120 flex>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select id="tabs" name="tabs" class="rounded-md border-gray-300 w-full block focus:border-indigo-500 focus:ring-indigo-500">
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="w-full  hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px" aria-label="Tabs">
          <button v-for="tab in tabs" :key="tab.name" class="font-medium border-b-2 text-center text-sm py-4 px-1 w-1/2" :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']" :aria-current="tab.current ? 'page' : undefined" @click="currentTab = tab">
            {{ tab.name }}
          </button>
        </nav>
      </div>
      <div p-5 max-h-screen overflow-y-scroll pb-25>
        <FormContent v-show="currentTab.name === 'New Content'" />
        <FormNFT v-show="currentTab.name === 'New NFT'" />
      </div>
    </div>
  </div>
</template>
