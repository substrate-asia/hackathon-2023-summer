<script setup lang="ts">
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <form>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="font-semibold text-base text-gray-900 leading-7">
          NFT
        </h2>
        <p class="mt-1 text-sm text-gray-600 leading-6">
          This information will be displayed publicly so be careful what you share.
        </p>

        <div class="mt-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="username" class="font-medium text-sm text-gray-900 leading-6 block">Username</label>
            <div class="mt-2">
              <div class="rounded-md flex shadow-sm ring-inset ring-1 ring-gray-300 sm:max-w-md focus-within:ring-inset focus-within:ring-2 focus-within:ring-indigo-600">
                <span class="flex pl-3 text-gray-500 select-none items-center sm:text-sm">workcation.com/</span>
                <input id="username" type="text" name="username" autocomplete="username" class="bg-transparent border-0 flex-1 py-1.5 pl-1 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-0" placeholder="janesmith">
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <label for="about" class="font-medium text-sm text-gray-900 leading-6 block">About</label>
            <div class="mt-2">
              <textarea id="about" name="about" rows="3" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600" />
            </div>
            <p class="mt-3 text-sm text-gray-600 leading-6">
              Write a few sentences about yourself.
            </p>
          </div>

          <div class="col-span-full">
            <label for="photo" class="font-medium text-sm text-gray-900 leading-6 block">Photo</label>
            <div class="flex mt-2 gap-x-3 items-center">
              <UserCircleIcon class="h-12 text-gray-300 w-12" aria-hidden="true" />
              <button type="button" class="bg-white rounded-md font-semibold shadow-sm ring-inset text-sm py-1.5 px-2.5 ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50">
                Change
              </button>
            </div>
          </div>

          <div class="col-span-full">
            <label for="cover-photo" class="font-medium text-sm text-gray-900 leading-6 block">Cover photo</label>
            <div class="border border-dashed rounded-lg flex border-gray-900/25 mt-2 py-10 px-6 justify-center">
              <div class="text-center">
                <PhotoIcon class="mx-auto h-12 text-gray-300 w-12" aria-hidden="true" />
                <div class="flex mt-4 text-sm text-gray-600 leading-6">
                  <label for="file-upload" class="bg-white rounded-md cursor-pointer font-semibold text-indigo-600 relative hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" class="sr-only">
                  </label>
                  <p class="pl-1">
                    or drag and drop
                  </p>
                </div>
                <p class="text-xs text-gray-600 leading-5">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="font-semibold text-base text-gray-900 leading-7">
          Personal Information
        </h2>
        <p class="mt-1 text-sm text-gray-600 leading-6">
          Use a permanent address where you can receive mail.
        </p>

        <div class="mt-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="first-name" class="font-medium text-sm text-gray-900 leading-6 block">First name</label>
            <div class="mt-2">
              <input id="first-name" type="text" name="first-name" autocomplete="given-name" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="last-name" class="font-medium text-sm text-gray-900 leading-6 block">Last name</label>
            <div class="mt-2">
              <input id="last-name" type="text" name="last-name" autocomplete="family-name" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="email" class="font-medium text-sm text-gray-900 leading-6 block">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="country" class="font-medium text-sm text-gray-900 leading-6 block">Country</label>
            <div class="mt-2">
              <select id="country" name="country" autocomplete="country-name" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block sm:max-w-xs sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>

          <div class="col-span-full">
            <label for="street-address" class="font-medium text-sm text-gray-900 leading-6 block">Street address</label>
            <div class="mt-2">
              <input id="street-address" type="text" name="street-address" autocomplete="street-address" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-2 sm:col-start-1">
            <label for="city" class="font-medium text-sm text-gray-900 leading-6 block">City</label>
            <div class="mt-2">
              <input id="city" type="text" name="city" autocomplete="address-level2" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="region" class="font-medium text-sm text-gray-900 leading-6 block">State / Province</label>
            <div class="mt-2">
              <input id="region" type="text" name="region" autocomplete="address-level1" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="postal-code" class="font-medium text-sm text-gray-900 leading-6 block">ZIP / Postal code</label>
            <div class="mt-2">
              <input id="postal-code" type="text" name="postal-code" autocomplete="postal-code" class="rounded-md border-0 shadow-sm ring-inset w-full py-1.5 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="font-semibold text-base text-gray-900 leading-7">
          Notifications
        </h2>
        <p class="mt-1 text-sm text-gray-600 leading-6">
          We'll always let you know about important changes, but you pick what else you want to hear about.
        </p>

        <div class="space-y-10 mt-10">
          <fieldset>
            <legend class="font-semibold text-sm text-gray-900 leading-6">
              By Email
            </legend>
            <div class="space-y-6 mt-6">
              <div class="flex gap-x-3 relative">
                <div class="flex h-6 items-center">
                  <input id="comments" name="comments" type="checkbox" class="rounded border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                </div>
                <div class="text-sm leading-6">
                  <label for="comments" class="font-medium text-gray-900">Comments</label>
                  <p class="text-gray-500">
                    Get notified when someones posts a comment on a posting.
                  </p>
                </div>
              </div>
              <div class="flex gap-x-3 relative">
                <div class="flex h-6 items-center">
                  <input id="candidates" name="candidates" type="checkbox" class="rounded border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                </div>
                <div class="text-sm leading-6">
                  <label for="candidates" class="font-medium text-gray-900">Candidates</label>
                  <p class="text-gray-500">
                    Get notified when a candidate applies for a job.
                  </p>
                </div>
              </div>
              <div class="flex gap-x-3 relative">
                <div class="flex h-6 items-center">
                  <input id="offers" name="offers" type="checkbox" class="rounded border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                </div>
                <div class="text-sm leading-6">
                  <label for="offers" class="font-medium text-gray-900">Offers</label>
                  <p class="text-gray-500">
                    Get notified when a candidate accepts or rejects an offer.
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend class="font-semibold text-sm text-gray-900 leading-6">
              Push Notifications
            </legend>
            <p class="mt-1 text-sm text-gray-600 leading-6">
              These are delivered via SMS to your mobile phone.
            </p>
            <div class="space-y-6 mt-6">
              <div class="flex gap-x-3 items-center">
                <input id="push-everything" name="push-notifications" type="radio" class="border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                <label for="push-everything" class="font-medium text-sm text-gray-900 leading-6 block">Everything</label>
              </div>
              <div class="flex gap-x-3 items-center">
                <input id="push-email" name="push-notifications" type="radio" class="border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                <label for="push-email" class="font-medium text-sm text-gray-900 leading-6 block">Same as email</label>
              </div>
              <div class="flex gap-x-3 items-center">
                <input id="push-nothing" name="push-notifications" type="radio" class="border-gray-300 h-4 text-indigo-600 w-4 focus:ring-indigo-600">
                <label for="push-nothing" class="font-medium text-sm text-gray-900 leading-6 block">No push notifications</label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="flex mt-6 gap-x-6 items-center justify-end">
      <button type="button" class="font-semibold text-sm text-gray-900 leading-6">
        Cancel
      </button>
      <button type="submit" class="rounded-md font-semibold bg-indigo-600 shadow-sm text-sm text-white py-2 px-3 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Save
      </button>
    </div>
  </form>
</template>
