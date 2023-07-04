import browser from "webextension-polyfill";
import * as U from '../util'

class ContentScript {
  constructor() {}

  listenWebPageMessages() {
    window.addEventListener("message", async function (msg) {
      if (msg.data.drumbeat) {
        U.Messenger.sendMessageToBackground(msg.data.type, msg.data.data)
      }
    })
  }

  listenBackageMessages() {
    browser.runtime.onMessage.addListener((message, sender) => {
      console.log(message, sender)
      const l = localStorage.getItem('sync_data')
      if (l) {
        const d = JSON.stringify({...JSON.parse(l), ...message.data})
        localStorage.setItem('sync_data', d)
      } else {
        localStorage.setItem('sync_data', JSON.stringify(message.data))
      }
      
    })
  }

  init() {
    console.log('welcome drumbeat extension!')
    this.listenWebPageMessages()
    this.listenBackageMessages()
  }
}
new ContentScript().init()
