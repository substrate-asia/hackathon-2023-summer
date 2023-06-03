<script setup lang="ts">
console.log('====> should finish all onboard module today 0603!!!')
</script>

<template>
  <div class="flex flex-col min-h-full flex-1 py-12 px-6 justify-center lg:px-8">
    <div class="mt-1/10 sm:mx-auto sm:max-w-sm sm:w-full">
      <img class="rounded-full mx-auto h-20 w-auto" src="https://avatars.githubusercontent.com/u/109504677?v=4" alt="Web3Hacker.World">
      <h2 class="font-bold mt-10 text-center text-white tracking-tight text-2xl leading-9">
        Welcome back <br>
        Web3 RWA World
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:max-w-sm sm:w-full">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="font-medium text-sm text-white leading-6 block">Password</label>
            <div class="text-sm hidden">
              <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" name="password" type="password" autocomplete="current-password" required="" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 px-2 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
          </div>
        </div>
        <div>
          <button type="submit" class="rounded-md flex font-semibold bg-indigo-500 shadow-sm text-sm text-white w-full py-1.5 px-3 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Unlock
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
