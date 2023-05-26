<script setup>
const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
]
</script>

<template>
  <div p-5>
    <ul role="list" class="divide-y divide-gray-100">
      <li v-for="person in people" :key="person.email" class="flex py-5 gap-x-6 justify-between">
        <div class="flex gap-x-4">
          <img class="rounded-full flex-none bg-gray-50 h-12 w-12" :src="person.imageUrl" alt="">
          <div class="flex-auto min-w-0">
            <p class="font-semibold text-sm text-gray-900 leading-6">
              {{ person.name }}
            </p>
            <p class="mt-1 text-xs text-gray-500 leading-5 truncate">
              {{ person.email }}
            </p>
          </div>
        </div>
        <div class="hidden sm:flex sm:flex-col sm:items-end">
          <p class="text-sm text-gray-900 leading-6">
            {{ person.role }}
          </p>
          <p v-if="person.lastSeen" class="mt-1 text-xs text-gray-500 leading-5">
            Last seen <time :datetime="person.lastSeenDateTime">{{ person.lastSeen }}</time>
          </p>
          <div v-else class="flex mt-1 gap-x-1.5 items-center">
            <div class="rounded-full flex-none bg-emerald-500/20 p-1">
              <div class="rounded-full bg-emerald-500 h-1.5 w-1.5" />
            </div>
            <p class="text-xs text-gray-500 leading-5">
              Online
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
