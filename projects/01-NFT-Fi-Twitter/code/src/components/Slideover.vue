<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
const {
  show,
} = defineProps<Props>()
defineEmits(['close'])
interface Props {
  show: boolean
}
</script>

<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="z-10 relative" @close="$emit('close')">
      <div class="inset-0 fixed" />

      <div class="inset-0 fixed overflow-hidden" @click="$emit('close')">
        <div class="inset-0 absolute overflow-hidden">
          <div class="flex max-w-full pl-10 inset-y-0 right-0 pointer-events-none fixed sm:pl-16">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel class="max-w-md w-screen pointer-events-auto">
                <div class="bg-white flex flex-col h-full shadow-xl overflow-y-scroll">
                  <div class="p-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="font-semibold text-base text-gray-900 leading-6">
                        Team
                      </DialogTitle>
                      <div class="flex h-7 ml-3 items-center">
                        <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500" @click="$emit('close')">
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <slot />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
