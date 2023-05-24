<script setup lang="ts">
const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Integrations', href: '#', current: false },
]
</script>

<template>
  <main>
    <header class="border-b border-white/5">
      <nav class="flex py-4 overflow-x-auto">
        <ul role="list" class="flex flex-none font-semibold min-w-full text-sm px-4 text-gray-400 leading-6 gap-x-6 sm:px-6 lg:px-8">
          <li v-for="item in secondaryNavigation" :key="item.name">
            <a :href="item.href" :class="item.current ? 'text-indigo-400' : ''">{{ item.name }}</a>
          </li>
        </ul>
      </nav>
    </header>

    <div class="divide-y divide-white/5">
      <div class="max-w-7xl grid py-16 px-4 gap-x-8 gap-y-10 grid-cols-1 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 class="font-semibold text-base text-white leading-7">
            Personal Information
          </h2>
          <p class="mt-1 text-sm text-gray-400 leading-6">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form class="md:col-span-2">
          <div class="grid gap-x-6 gap-y-8 grid-cols-1 sm:max-w-xl sm:grid-cols-6">
            <div class="flex col-span-full gap-x-8 items-center">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="rounded-lg flex-none object-cover bg-gray-800 h-24 w-24">
              <div>
                <button type="button" class="rounded-md font-semibold bg-white/10 shadow-sm text-sm text-white py-2 px-3 hover:bg-white/20">
                  Change avatar
                </button>
                <p class="mt-2 text-xs text-gray-400 leading-5">
                  JPG, GIF or PNG. 1MB max.
                </p>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="first-name" class="font-medium text-sm text-white leading-6 block">First name</label>
              <div class="mt-2">
                <input id="first-name" type="text" name="first-name" autocomplete="given-name" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="sm:col-span-3">
              <label for="last-name" class="font-medium text-sm text-white leading-6 block">Last name</label>
              <div class="mt-2">
                <input id="last-name" type="text" name="last-name" autocomplete="family-name" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="col-span-full">
              <label for="email" class="font-medium text-sm text-white leading-6 block">Email address</label>
              <div class="mt-2">
                <input id="email" name="email" type="email" autocomplete="email" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="col-span-full">
              <label for="username" class="font-medium text-sm text-white leading-6 block">Username</label>
              <div class="mt-2">
                <div class="rounded-md flex bg-white/5 ring-inset ring-1 ring-white/10 focus-within:ring-inset focus-within:ring-2 focus-within:ring-indigo-500">
                  <span class="flex pl-3 text-gray-400 select-none items-center sm:text-sm">example.com/</span>
                  <input id="username" type="text" name="username" autocomplete="username" class="bg-transparent border-0 flex-1 text-white py-1.5 pl-1 sm:text-sm sm:leading-6 focus:ring-0" placeholder="janesmith">
                </div>
              </div>
            </div>

            <div class="col-span-full">
              <label for="timezone" class="font-medium text-sm text-white leading-6 block">Timezone</label>
              <div class="mt-2">
                <select id="timezone" name="timezone" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block [&_*]:text-black sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
                  <option>Pacific Standard Time</option>
                  <option>Eastern Standard Time</option>
                  <option>Greenwich Mean Time</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit" class="rounded-md font-semibold bg-indigo-500 shadow-sm text-sm text-white py-2 px-3 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Save
            </button>
          </div>
        </form>
      </div>
      <div class="max-w-7xl grid py-16 px-4 gap-x-8 gap-y-10 grid-cols-1 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 class="font-semibold text-base text-white leading-7">
            Change password
          </h2>
          <p class="mt-1 text-sm text-gray-400 leading-6">
            Update your password associated with your account.
          </p>
        </div>

        <form class="md:col-span-2">
          <div class="grid gap-x-6 gap-y-8 grid-cols-1 sm:max-w-xl sm:grid-cols-6">
            <div class="col-span-full">
              <label for="current-password" class="font-medium text-sm text-white leading-6 block">Current password</label>
              <div class="mt-2">
                <input id="current-password" name="current_password" type="password" autocomplete="current-password" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="col-span-full">
              <label for="new-password" class="font-medium text-sm text-white leading-6 block">New password</label>
              <div class="mt-2">
                <input id="new-password" name="new_password" type="password" autocomplete="new-password" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="col-span-full">
              <label for="confirm-password" class="font-medium text-sm text-white leading-6 block">Confirm password</label>
              <div class="mt-2">
                <input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit" class="rounded-md font-semibold bg-indigo-500 shadow-sm text-sm text-white py-2 px-3 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Save
            </button>
          </div>
        </form>
      </div>

      <div class="max-w-7xl grid py-16 px-4 gap-x-8 gap-y-10 grid-cols-1 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 class="font-semibold text-base text-white leading-7">
            Log out other sessions
          </h2>
          <p class="mt-1 text-sm text-gray-400 leading-6">
            Please enter your password to confirm you would like to log out of your other sessions across all of your devices.
          </p>
        </div>

        <form class="md:col-span-2">
          <div class="grid gap-x-6 gap-y-8 grid-cols-1 sm:max-w-xl sm:grid-cols-6">
            <div class="col-span-full">
              <label for="logout-password" class="font-medium text-sm text-white leading-6 block">Your password</label>
              <div class="mt-2">
                <input id="logout-password" name="password" type="password" autocomplete="current-password" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
          </div>

          <div class="flex mt-8">
            <button type="submit" class="rounded-md font-semibold bg-indigo-500 shadow-sm text-sm text-white py-2 px-3 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
              Log out other sessions
            </button>
          </div>
        </form>
      </div>

      <div class="max-w-7xl grid py-16 px-4 gap-x-8 gap-y-10 grid-cols-1 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 class="font-semibold text-base text-white leading-7">
            Delete account
          </h2>
          <p class="mt-1 text-sm text-gray-400 leading-6">
            No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.
          </p>
        </div>

        <form class="flex items-start md:col-span-2">
          <button type="submit" class="rounded-md font-semibold bg-red-500 shadow-sm text-sm text-white py-2 px-3 hover:bg-red-400">
            Yes, delete my account
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
