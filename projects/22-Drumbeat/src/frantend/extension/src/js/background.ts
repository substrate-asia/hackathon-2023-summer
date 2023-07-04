import browser from 'webextension-polyfill'
import * as U from '../util'

class Background {
  private whiteList: U.Domain[] = U.WHITE_LIST.products

  constructor() {
  }

  initScore() {
    browser.storage.local.set({
      score: {
        DeFi: 0,
        GameFi: 0,
        NFT: 0,
        Metaverse: 0,
        OnChainData: 0
      }
    })
  }

  listenForMessages() {
    browser.runtime.onMessage.addListener((message, sender) => {
      const { type, data } = message
      const tabId = sender.tab?.id
      browser.storage.local.set({ tabId }).then()
      this.handleDealMessages(type, data)
    })
  }

  handleDealMessages(type: string, data: any) {
    switch (type) {
      case U.C.DRUMBEAT_MSG_HACKATHON_ACCOUNT:
        this.saveInfo(data)
        break
      case U.C.DRUMBEAT_MSG_HACKATHON_SYNC:
        this.sendInfoToContent()
        break

      default:
        break
    }
  }

  saveInfo(data: any) {
    browser.storage.local.set({ address: data.address, step: 1 })
  }

  async sendInfoToContent() {
    const { tabId } = await browser.storage.local.get(['tabId'])
    U.Messenger.sendMessageToContentScript(tabId, U.C.DRUMBEAT_MSG_HACKATHON_SYNC_TO, { hh: 'iamsa' })
  }

  private reportBroswer(tab: any) {
    if (!this.whiteList.length) {
      return
    }
    const isIn = U.Helper.isInWhiteList(this.whiteList, tab.url || '-1')
    if (isIn) {
      const idx = U.Helper.currentDomainIdx(this.whiteList, tab.url || '-1')
      const timer = setTimeout(async () => {
        clearTimeout(timer)

        console.log('report', idx, this.whiteList[idx].category)
        const categorys = this.whiteList[idx].category
        const { score } = await browser.storage.local.get(['score'])
        categorys.forEach((item) => {
          score[item] += 100
        })

        console.log(categorys, score)
        await browser.storage.local.set({ score: { ...score } })
      }, U.C.REPORTING_TIME)
    }
  }

  listenTabChange() {
    browser.tabs.onActivated.addListener(l => {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(activeTab => {
          this.reportBroswer(activeTab[0])
        })
    })
  }

  listenTabUpdate() {
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        this.reportBroswer(tab)
      }
    })
  }

  init() {
    browser.storage.local.set({ tabId: '' })
    this.initScore()
    this.listenForMessages()
    this.listenTabChange()
    this.listenTabUpdate()
  }
}

new Background().init()
