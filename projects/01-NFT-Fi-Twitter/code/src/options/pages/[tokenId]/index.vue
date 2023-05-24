<script setup>
import { ref } from 'vue'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/vue/24/outline'

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
const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Activity', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
  { name: 'Collaborators', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
]
const stats = [
  { name: 'Number of deploys', value: '405' },
  { name: 'Average deploy time', value: '3.65', unit: 'mins' },
  { name: 'Number of servers', value: '3' },
  { name: 'Success rate', value: '98.5%' },
]
const statuses = { Completed: 'text-green-400 bg-green-400/10', Error: 'text-rose-400 bg-rose-400/10' }
const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    commit: '2d89f0c8',
    branch: 'main',
    status: 'Completed',
    duration: '25s',
    date: '45 minutes ago',
    dateTime: '2023-01-23T11:00',
  },
  // More items...
]

const sidebarOpen = ref(false)
</script>

<template>
  <main>
    <header>
      <!-- Secondary navigation -->
      <nav class="border-b flex border-white/10 py-4 overflow-x-auto">
        <ul role="list" class="flex flex-none font-semibold min-w-full text-sm px-4 text-gray-400 leading-6 gap-x-6 sm:px-6 lg:px-8">
          <li v-for="item in secondaryNavigation" :key="item.name">
            <a :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
          </li>
        </ul>
      </nav>

      <!-- Heading -->
      <div class="flex flex-col bg-gray-700/10 py-4 px-4 gap-x-8 gap-y-4 items-start justify-between sm:flex-row sm:px-6 sm:items-center lg:px-8">
        <div>
          <div class="flex gap-x-3 items-center">
            <div class="rounded-full flex-none bg-green-400/10 p-1 text-green-400">
              <div class="bg-current rounded-full h-2 w-2" />
            </div>
            <h1 class="flex text-base leading-7 gap-x-3">
              <span class="font-semibold text-white">Planetaria</span>
              <span class="text-gray-600">/</span>
              <span class="font-semibold text-white">mobile-api</span>
            </h1>
          </div>
          <p class="mt-2 text-xs text-gray-400 leading-6">
            Deploys from GitHub via main branch
          </p>
        </div>
        <div class="rounded-full flex-none order-first font-medium bg-indigo-400/10 ring-inset text-xs py-1 px-2 ring-1 ring-indigo-400/30 text-indigo-400 sm:order-none">
          Production
        </div>
      </div>

      <!-- Stats -->
      <div class="bg-gray-700/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, statIdx) in stats" :key="stat.name" class="border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8" :class="[statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '']">
          <p class="font-medium text-sm text-gray-400 leading-6">
            {{ stat.name }}
          </p>
          <p class="flex mt-2 gap-x-2 items-baseline">
            <span class="font-semibold text-white tracking-tight text-4xl">{{ stat.value }}</span>
            <span v-if="stat.unit" class="text-sm text-gray-400">{{ stat.unit }}</span>
          </p>
        </div>
      </div>
    </header>

    <!-- Activity list -->
    <div class="border-t border-white/10 pt-11">
      <h2 class="font-semibold text-base text-white px-4 leading-7 sm:px-6 lg:px-8">
        Latest activity
      </h2>
      <table class="mt-6 text-left w-full whitespace-nowrap">
        <colgroup>
          <col class="w-full sm:w-4/12">
          <col class="lg:w-4/12">
          <col class="lg:w-2/12">
          <col class="lg:w-1/12">
          <col class="lg:w-1/12">
        </colgroup>
        <thead class="border-b border-white/10 text-sm text-white leading-6">
          <tr>
            <th scope="col" class="font-semibold py-2 pr-8 pl-4 sm:pl-6 lg:pl-8">
              User
            </th>
            <th scope="col" class="font-semibold py-2 pr-8 pl-0 hidden sm:table-cell">
              Commit
            </th>
            <th scope="col" class="font-semibold text-right py-2 pr-4 pl-0 sm:text-left sm:pr-8 lg:pr-20">
              Status
            </th>
            <th scope="col" class="font-semibold py-2 pr-8 pl-0 hidden md:table-cell lg:pr-20">
              Duration
            </th>
            <th scope="col" class="font-semibold text-right py-2 pr-4 pl-0 hidden sm:pr-6 sm:table-cell lg:pr-8">
              Deployed at
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="item in activityItems" :key="item.commit">
            <td class="py-4 pr-8 pl-4 sm:pl-6 lg:pl-8">
              <div class="flex gap-x-4 items-center">
                <img :src="item.user.imageUrl" alt="" class="rounded-full bg-gray-800 h-8 w-8">
                <div class="font-medium text-sm text-white leading-6 truncate">
                  {{ item.user.name }}
                </div>
              </div>
            </td>
            <td class="py-4 pr-4 pl-0 hidden sm:pr-8 sm:table-cell">
              <div class="flex gap-x-3">
                <div class="font-mono text-sm text-gray-400 leading-6">
                  {{ item.commit }}
                </div>
                <span class="rounded-md font-medium bg-gray-400/10 ring-inset text-xs py-1 px-2 ring-1 ring-gray-400/20 text-gray-400 inline-flex items-center">{{ item.branch }}</span>
              </div>
            </td>
            <td class="text-sm py-4 pr-4 pl-0 leading-6 sm:pr-8 lg:pr-20">
              <div class="flex gap-x-2 items-center justify-end sm:justify-start">
                <time class="text-gray-400 sm:hidden" :datetime="item.dateTime">{{ item.date }}</time>
                <div class="rounded-full flex-none p-1" :class="[statuses[item.status]]">
                  <div class="bg-current rounded-full h-1.5 w-1.5" />
                </div>
                <div class="text-white hidden sm:block">
                  {{ item.status }}
                </div>
              </div>
            </td>
            <td class="text-sm py-4 pr-8 pl-0 text-gray-400 leading-6 hidden md:table-cell lg:pr-20">
              {{ item.duration }}
            </td>
            <td class="text-right text-sm py-4 pr-4 pl-0 text-gray-400 leading-6 hidden sm:pr-6 sm:table-cell lg:pr-8">
              <time :datetime="item.dateTime">{{ item.date }}</time>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
