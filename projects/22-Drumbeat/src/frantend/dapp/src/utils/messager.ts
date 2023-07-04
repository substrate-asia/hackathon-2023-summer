import * as U from './'

class Messager {
  static sendMessageToContent(type: string, data: any) {
    const target = 'drumbeat'
    const msg: U.T.IMessage<any> = { type, data, drumbeat: target }
    window.postMessage(msg, '*')
  }
}

export default Messager
