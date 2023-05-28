<script setup lang="ts">
const emit = defineEmits(['setTitle'])
emit('setTitle', 'Create Password')
const isShowPwd1 = ref(false)
const isShowPwd2 = ref(false)

const password1 = ref('eF*;CTYW8d9(43U')
const password2 = ref('')
const hasLowercase = computed(() => (new RegExp('(?=.*[a-z])')).test(password1.value))
const hasUppercase = computed(() => (new RegExp('(?=.*[A-Z])')).test(password1.value))
const hasNumber = computed(() => (new RegExp('(?=.*[0-9])')).test(password1.value))
const hasSpecial = computed(() => (new RegExp('(?=.*[^A-Za-z0-9])')).test(password1.value))
const isLongEnough = computed(() => (new RegExp('(?=.{15,})')).test(password1.value))
const isStrong = computed(() => hasLowercase.value && hasUppercase.value && hasNumber.value && hasSpecial.value && isLongEnough.value)
const isMatch = computed(() => password1.value === password2.value)
const isShowNotMatch = computed(() => !isMatch.value && password2.value !== '')
const isAgree = ref(false)
const isValid = computed(() => password1.value && isMatch.value && isAgree.value && isStrong.value)

const doSubmit = async () => {
  console.log('====> doSubmit :')
}
</script>

<template>
  <div class="space-y-6 text-white">
    <div text-lg>
      This password will unlock your Buidlers.Space wallet only on this device. Buidlers.Space can not recover this password.
    </div>
    <div>
      <div class="flex items-center justify-between">
        <label for="password1" class="font-medium text-sm  leading-6 block">New Password</label>
      </div>
      <div class="rounded-md flex shadow-sm mt-2">
        <input id="password1" v-model="password1" name="password1" :type="isShowPwd1 ? 'text' : 'password'" autocomplete="current-password" required="" class="rounded-l-md bg-white/5 border-0 shadow-sm ring-inset  w-full py-1.5 px-3 ring-1 ring-white/10 block sm:text-sm sm:leading-6  focus:ring-1 focus:ring-indigo-500">
        <button type="button" class="rounded-r-md font-semibold -ml-px ring-inset text-sm  py-2 px-5 ring-1  relative inline-flex items-center hover:opacity-80 " @click="isShowPwd1 = !isShowPwd1">
          <material-symbols-disabled-visible v-if="isShowPwd1" />
          <ic-baseline-remove-red-eye v-else />
        </button>
      </div>
      <p v-show="password1 !== ''" class="mt-2 text-sm">
        Passwords strength: <span :class="isStrong ? 'text-green-500' : 'text-red-600'">{{ isStrong ? 'Strong' : 'Week' }}</span>
        <ul v-show="!isStrong">
          <li flex :class="hasLowercase ? 'text-green-500' : 'text-red-600'">
            <ic-sharp-check v-if="hasLowercase" mr-2 />
            <gridicons-cross v-else mr-2 /> Lowercase
          </li>
          <li flex :class="hasUppercase ? 'text-green-500' : 'text-red-600'">
            <ic-sharp-check v-if="hasUppercase" mr-2 />
            <gridicons-cross v-else mr-2 /> Uppercase
          </li>
          <li flex :class="hasNumber ? 'text-green-500' : 'text-red-600'">
            <ic-sharp-check v-if="hasNumber" mr-2 />
            <gridicons-cross v-else mr-2 /> Number (0-9)
          </li>
          <li flex :class="hasSpecial ? 'text-green-500' : 'text-red-600'">
            <ic-sharp-check v-if="hasSpecial" mr-2 />
            <gridicons-cross v-else mr-2 /> Special Character (!@#$%^&*)
          </li>
          <li flex :class="isLongEnough ? 'text-green-500' : 'text-red-600'">
            <ic-sharp-check v-if="isLongEnough" mr-2 />
            <gridicons-cross v-else mr-2 /> Atleast 15 Character
          </li>
        </ul>
      </p>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <label for="password2" class="font-medium text-sm  leading-6 block">Confirm Password</label>
      </div>
      <div class="rounded-md flex shadow-sm mt-2">
        <input id="password2" v-model="password2" name="password2" :type="isShowPwd2 ? 'text' : 'password'" autocomplete="current-password" required="" class="rounded-l-md bg-white/5 border-0 shadow-sm ring-inset  w-full py-1.5 px-3 ring-1  block sm:text-sm sm:leading-6  focus:ring-1 focus:ring-indigo-500" :class="isShowNotMatch ? 'text-red-900 ring-red-300' : 'ring-white/10'">
        <button type="button" class="rounded-r-md font-semibold -ml-px ring-inset text-sm  py-2 px-5 ring-1  relative inline-flex items-center hover:opacity-80 " @click="isShowPwd2 = !isShowPwd2">
          <material-symbols-disabled-visible v-if="isShowPwd2" />
          <ic-baseline-remove-red-eye v-else />
        </button>
      </div>
      <p v-show="isShowNotMatch" class="mt-2 text-sm text-red-600">
        Passwords don't match
      </p>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input id="agree" v-model="isAgree" name="agree" type="checkbox" class="rounded border-gray-300 h-4 mr-4 text-indigo-600 w-4 focus:ring-indigo-600">
        <label for="agree" class="text-sm ml-3leading-6 block">I understand that Buidlers.Space cannot recover this password for me. </label>
      </div>
    </div>

    <div>
      <button class="rounded-md  flex  font-semibold bg-indigo-500  shadow-sm text-sm w-full py-1.5 px-3  leading-6 justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 " :disabled="!isValid" @click="doSubmit">
        Create a new wallet
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: onboarding
</route>
