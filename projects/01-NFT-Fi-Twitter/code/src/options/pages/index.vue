<script setup>
import { ref } from 'vue'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/vue/24/outline'
import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: true },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
]
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]
const statuses = {
  offline: 'text-gray-500 bg-gray-100/10',
  online: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const deployments = [
  {
    id: 1,
    href: '#',
    projectName: 'ios-app',
    teamName: 'Planetaria',
    status: 'offline',
    statusText: 'Initiated 1m 32s ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
  // More deployments...
]
const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  // More items...
]

const sidebarOpen = ref(false)
</script>

<template>
  <div>
    <main class="lg:pr-96">
      <header class="border-b flex border-white/5 py-4 px-4 items-center justify-between sm:py-6 sm:px-6 lg:px-8">
        <h1 class="font-semibold text-base text-white leading-7">
          Deployments
        </h1>

        <!-- Sort dropdown -->
        <Menu as="div" class="relative">
          <MenuButton class="flex font-medium text-sm text-white leading-6 gap-x-1 items-center">
            Sort by
            <ChevronUpDownIcon class="h-5 text-gray-500 w-5" aria-hidden="true" />
          </MenuButton>
          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="bg-white rounded-md shadow-lg mt-2.5 py-2 origin-top-right right-0 ring-1 ring-gray-900/5 w-40 z-10 absolute focus:outline-none">
              <MenuItem v-slot="{ active }">
                <a href="#" class="text-sm py-1 px-3 text-gray-900 leading-6 block" :class="[active ? 'bg-gray-50' : '']">Name</a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a href="#" class="text-sm py-1 px-3 text-gray-900 leading-6 block" :class="[active ? 'bg-gray-50' : '']">Date updated</a>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a href="#" class="text-sm py-1 px-3 text-gray-900 leading-6 block" :class="[active ? 'bg-gray-50' : '']">Environment</a>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </header>

      <!-- Deployment list -->
      <ul role="list" class="divide-y divide-white/5">
        <li v-for="deployment in deployments" :key="deployment.id" class="flex space-x-4 py-4 px-4 relative items-center sm:px-6 lg:px-8">
          <div class="flex-auto min-w-0">
            <div class="flex gap-x-3 items-center">
              <div class="rounded-full flex-none p-1" :class="[statuses[deployment.status]]">
                <div class="bg-current rounded-full h-2 w-2" />
              </div>
              <h2 class="font-semibold text-sm text-white min-w-0 leading-6">
                <a :href="deployment.href" class="flex gap-x-2">
                  <span class="truncate">{{ deployment.teamName }}</span>
                  <span class="text-gray-400">/</span>
                  <span class="whitespace-nowrap">{{ deployment.projectName }}</span>
                  <span class="inset-0 absolute" />
                </a>
              </h2>
            </div>
            <div class="flex mt-3 text-xs text-gray-400 leading-5 gap-x-2.5 items-center">
              <p class="truncate">
                {{ deployment.description }}
              </p>
              <svg viewBox="0 0 2 2" class="flex-none h-0.5 fill-gray-300 w-0.5">
                <circle cx="1" cy="1" r="1" />
              </svg>
              <p class="whitespace-nowrap">
                {{ deployment.statusText }}
              </p>
            </div>
          </div>
          <div class="rounded-full flex-none font-medium ring-inset text-xs py-1 px-2 ring-1" :class="[environments[deployment.environment]]">
            {{ deployment.environment }}
          </div>
          <ChevronRightIcon class="flex-none h-5 text-gray-400 w-5" aria-hidden="true" />
        </li>
      </ul>
    </main>
    <aside class="bg-black/10 lg:border-l lg:border-white/5 lg:top-16 lg:right-0 lg:bottom-0 lg:w-96 lg:fixed lg:overflow-y-auto">
      <header class="border-b flex border-white/5 py-4 px-4 items-center justify-between sm:py-6 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-base text-white leading-7">
          Activity feed
        </h2>
        <a href="#" class="font-semibold text-sm text-indigo-400 leading-6">View all</a>
      </header>
      <ul role="list" class="divide-y divide-white/5">
        <li v-for="item in activityItems" :key="item.commit" class="py-4 px-4 sm:px-6 lg:px-8">
          <div class="flex gap-x-3 items-center">
            <img :src="item.user.imageUrl" alt="" class="rounded-full flex-none bg-gray-800 h-6 w-6">
            <h3 class="flex-auto font-semibold text-sm text-white leading-6 truncate">
              {{ item.user.name }}
            </h3>
            <time :datetime="item.dateTime" class="flex-none text-xs text-gray-600">{{ item.date }}</time>
          </div>
          <p class="mt-3 text-sm text-gray-500 truncate">
            Pushed to <span class="text-gray-400">{{ item.projectName }}</span> (<span class="font-mono text-gray-400">{{ item.commit }}</span> on <span class="text-gray-400">{{ item.branch }}</span>)
          </p>
        </li>
      </ul>
    </aside>
  </div>
</template>
