/* eslint-disable unicorn/prefer-node-protocol */
import { Buffer } from 'buffer'

import { createApp } from 'vue'

import App from './App.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

window.Buffer = Buffer

const app = createApp(App)
setupApp(app)
app.mount('#app')
