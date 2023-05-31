/* eslint-disable unicorn/prefer-node-protocol */
import { Buffer } from 'buffer'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

window.Buffer = Buffer

const routes = setupLayouts(generatedRoutes)

const app = createApp(App)
setupApp(app)

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(router)
app.mount('#app')
