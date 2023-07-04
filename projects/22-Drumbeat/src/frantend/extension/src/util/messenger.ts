import browser from 'webextension-polyfill'

class Messenger {
  /**
   * Send a message to Background script
   *
   * @param {BackgroundMessage} type Background Message Type
   * @param {*} [data=null]
   * @return {*}
   */
  static async sendMessageToBackground(type: any, data: any = null) {
    try {
      const response = await browser.runtime.sendMessage({ type, data });
      return response;
    } catch (error) {
      console.error("sendMessageToBackground error: ", error);
      return null;
    }
  }

  /**
   * Send a message to Content Script of a Tab
   *
   * @param {number} tabID Tab ID
   * @param {ContentScriptMessage} type
   * @param {*} [data=null]
   * @return {*}
   */
  static async sendMessageToContentScript(tabID: number, type: any, data: any = null) {
    try {
      const response = await browser.tabs.sendMessage(tabID, { type, data });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error("sendMessageToContentScript error: ", error);
      return null;
    }
  }
}

export default Messenger;