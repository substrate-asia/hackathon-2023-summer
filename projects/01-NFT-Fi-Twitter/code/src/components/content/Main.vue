<script setup lang="ts">
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

interface Props {
  modelValue: boolean
}
const {
  modelValue,
} = defineProps<Props>()
const emit = defineEmits(["update:modelValue"])

const tabs = [
  { name: 'All', href: '#', current: true },
  { name: 'Online', href: '#', current: false },
  { name: 'Offline', href: '#', current: false },
]
const team = [
  {
    name: 'Leslie Alexander',
    handle: 'lesliealexander',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
]
</script>

<template>
  <div>
    <div class="border-b border-gray-200">
      <div class="px-6">
        <nav class="flex -mb-px space-x-6" x-descriptions="Tab component">
          <a v-for="tab in tabs" :key="tab.name" :href="tab.href" class="font-medium border-b-2 text-sm px-1 pb-4 whitespace-nowrap" :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">{{ tab.name }}</a>
        </nav>
      </div>
    </div>
    <ul role="list" class="divide-y divide-gray-200 flex-1 overflow-y-auto">
      <li v-for="person in team" :key="person.handle">
        <div class="flex py-6 px-5 group relative items-center">
          <a :href="person.href" class="flex-1 -m-1 p-1 block">
            <div class="inset-0 absolute group-hover:bg-gray-50" aria-hidden="true" />
            <div class="flex flex-1 min-w-0 relative items-center">
              <span class="flex-shrink-0 relative inline-block">
                <img class="rounded-full h-10 w-10" :src="person.imageUrl" alt="">
                <span class="rounded-full h-2.5 ring-white top-0 right-0 ring-2 w-2.5 absolute block" :class="[person.status === 'online' ? 'bg-green-400' : 'bg-gray-300']" aria-hidden="true" />
              </span>
              <div class="ml-4 truncate">
                <p class="font-medium text-sm text-gray-900 truncate">{{ person.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ `@${person.handle}` }}</p>
              </div>
            </div>
          </a>
          <Menu as="div" class="flex-shrink-0 text-left ml-2 relative inline-block">
            <MenuButton class="bg-white rounded-full h-8 w-8 group relative inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">Open options menu</span>
              <span class="rounded-full flex h-full w-full items-center justify-center">
                <EllipsisVerticalIcon class="h-5 text-gray-400 w-5 group-hover:text-gray-500" aria-hidden="true" />
              </span>
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="bg-white rounded-md shadow-lg ring-black origin-top-right top-0 right-9 ring-1 ring-opacity-5 w-48 z-10 absolute focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                  <a href="#" class="text-sm py-2 px-4 block" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']">View profile</a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                  <a href="#" class="text-sm py-2 px-4 block" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700']">Send message</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </li>
    </ul>
  </div>
</template>
