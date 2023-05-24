<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
]
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
]

const sidebarOpen = ref(false)
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="z-50 relative xl:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="bg-gray-900/80 inset-0 fixed" />
        </TransitionChild>
        <div class="flex inset-0 fixed">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="flex max-w-xs flex-1 mr-16 w-full relative">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="flex left-full pt-5 top-0 w-16 absolute justify-center">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 text-white w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="flex flex-col bg-gray-900 px-6 ring-1 ring-white/10 gap-y-5 grow overflow-y-auto">
                <div class="flex h-16 items-center shrink-0">
                  <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
                </div>
                <nav class="flex flex-col flex-1">
                  <ul role="list" class="flex flex-col flex-1 gap-y-7">
                    <li>
                      <ul role="list" class="space-y-1 -mx-2">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href" class="rounded-md flex font-semibold text-sm p-2 leading-6 gap-x-3 group" :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800']">
                            <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="font-semibold text-xs text-gray-400 leading-6">
                        Your teams
                      </div>
                      <ul role="list" class="space-y-1 -mx-2 mt-2">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href" class="rounded-md flex font-semibold text-sm p-2 leading-6 gap-x-3 group" :class="[team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800']">
                            <span class="border rounded-lg flex font-medium bg-gray-800 border-gray-700 h-6 text-[0.625rem] text-gray-400 w-6 items-center justify-center shrink-0 group-hover:text-white">{{ team.initial }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li class="mt-auto -mx-6">
                      <a href="#" class="flex font-semibold text-sm text-white py-3 px-6 leading-6 gap-x-4 items-center hover:bg-gray-800">
                        <img class="rounded-full bg-gray-800 h-8 w-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                        <span class="sr-only">Your profile</span>
                        <span aria-hidden="true">Tom Cook</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden xl:flex xl:flex-col xl:inset-y-0 xl:w-72 xl:z-50 xl:fixed">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex flex-col bg-black/10 px-6 ring-1 ring-white/5 gap-y-5 grow overflow-y-auto">
        <div class="flex h-16 items-center shrink-0">
          <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
        </div>
        <nav class="flex flex-col flex-1">
          <ul role="list" class="flex flex-col flex-1 gap-y-7">
            <li>
              <ul role="list" class="space-y-1 -mx-2">
                <li v-for="item in navigation" :key="item.name">
                  <a :href="item.href" class="rounded-md flex font-semibold text-sm p-2 leading-6 gap-x-3 group" :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800']">
                    <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="font-semibold text-xs text-gray-400 leading-6">
                Your teams
              </div>
              <ul role="list" class="space-y-1 -mx-2 mt-2">
                <li v-for="team in teams" :key="team.name">
                  <a :href="team.href" class="rounded-md flex font-semibold text-sm p-2 leading-6 gap-x-3 group" :class="[team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800']">
                    <span class="border rounded-lg flex font-medium bg-gray-800 border-gray-700 h-6 text-[0.625rem] text-gray-400 w-6 items-center justify-center shrink-0 group-hover:text-white">{{ team.initial }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="mt-auto -mx-6">
              <a href="#" class="flex font-semibold text-sm text-white py-3 px-6 leading-6 gap-x-4 items-center hover:bg-gray-800">
                <img class="rounded-full bg-gray-800 h-8 w-8" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                <span class="sr-only">Your profile</span>
                <span aria-hidden="true">Tom Cook</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="xl:pl-72">
      <!-- Sticky search header -->
      <div class="border-b flex bg-gray-900 border-white/5 h-16 shadow-sm px-4 top-0 z-40 gap-x-6 sticky items-center shrink-0 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 text-white p-2.5 xl:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-5 w-5" aria-hidden="true" />
        </button>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form class="flex flex-1" action="#" method="GET">
            <label for="search-field" class="sr-only">Search</label>
            <div class="w-full relative">
              <MagnifyingGlassIcon class="h-full inset-y-0 left-0 text-gray-500 w-5 pointer-events-none absolute" aria-hidden="true" />
              <input id="search-field" class="bg-transparent h-full border-0 text-white w-full py-0 pr-0 pl-8 block sm:text-sm focus:ring-0" placeholder="Search..." type="search" name="search">
            </div>
          </form>
        </div>
      </div>

      <RouterView />
    </div>
  </div>
</template>
