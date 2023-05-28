<script setup lang="ts">

</script>

<template>
  <div>
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label for="email" class="font-medium text-sm text-white leading-6 block">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required="" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="font-medium text-sm text-white leading-6 block">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required="" class="rounded-md bg-white/5 border-0 shadow-sm ring-inset text-white w-full py-1.5 ring-1 ring-white/10 block sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-500">
        </div>
      </div>

      <div>
        <button type="submit" class="rounded-md flex font-semibold bg-indigo-500 shadow-sm text-sm text-white w-full py-1.5 px-3 leading-6 justify-center hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          Sign in
        </button>
      </div>
    </form>

    <p class="mt-10 text-center text-sm text-gray-400">
      Not a member?
      {{ ' ' }}
      <a href="#" class="font-semibold text-indigo-400 leading-6 hover:text-indigo-300">Start a 14 day free trial</a>
    </p>
  </div>
</template>
