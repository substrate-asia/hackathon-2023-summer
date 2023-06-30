function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const url = 'wss://api.sweetsai.net/api/chat/chatgpt'
const token = 'qUU7dyefcxmWaFXNT3A-aGAhshgj11IJpoicJhY_3AIba1Vy-qw5Wb7'

class ChatGPT {
  /** @type {WebSocket} */
  socket = null
  ready = false

  model
  sessionId

  isStoped = false
  output
  outputFinished = false
  constructor() {
    this.ready = false
  }
  connect() {
    if (this.socket?.readyState === WebSocket.CONNECTING) {
      return
    }

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(`${url}?token=${token}`)

        const onmessage = this.handleMessage.bind(this)

        this.socket.addEventListener(
          'open',
          async () => {
            console.log('websocket连接')
            this.ready = true

            this.sessionId = 'JyJoZH692fMz5SFd4nQ_Hhc4wCcwKuP9'
            this.model = 137

            this.socket.onmessage = onmessage
            resolve(true)
          },
          { once: true }
        )

        this.socket.addEventListener(
          'close',
          (err) => {
            console.log('websocket关闭', err.reason)

            if (this.ready) {
              this.socket.removeEventListener('message', onmessage)
            }
            this.ready = false

            reject(err.reason)
          },
          { once: true }
        )

        this.socket.addEventListener(
          'error',
          (err) => {
            console.log('websocket错误', err)

            this.ready = false

            reject(err)
          },
          { once: true }
        )
      } catch (error) {}
    })
  }
  on() {
    this.socket.on(...arguments)
  }
  close() {
    this.socket.close()
    this.socket = null
  }
  send(content = '', { step = null, finish = null } = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.socket?.readyState === WebSocket.CONNECTING) {
          return
        } else if (this.socket?.readyState !== WebSocket.OPEN) {
          await this.connect()
        }

        this.outputFinished = false
        this.isStoped = false

        this.socket.send(
          JSON.stringify({
            session_id: this.sessionId || '',
            content,
            model: this.model || ''
          })
        )

        let output = '',
          isStop = false
        /**
         *
         * @param {MessageEvent} ev
         * @returns
         */
        const onmessage = (ev) => {
          if (isStop) return

          if (ev.data === '20000*****FOE*****') {
            // 开始
            step?.('start')
            clearTimeout(timer)
          } else if (ev.data === '*****EOF*****') {
            // 结束
            onfinish()
            return
          }
          const data = ev.data
          step?.('append', data)
          output += data
        }
        const onstop = () => {
          isStop = true
          onfinish()
        }
        const onfinish = () => {
          this.socket.removeEventListener('message', onmessage)
          this.socket.removeEventListener('stop', onstop)
          step?.('end')
          finish?.(output)
          resolve(output)
        }

        const timer = setTimeout(() => {
          this.socket.removeEventListener('message', onmessage)
          this.socket.removeEventListener('stop', onstop)
          reject('响应超时')
        }, 5000)
        this.socket.addEventListener('stop', onstop, {
          once: true
        })

        this.socket.addEventListener('message', onmessage)
      } catch (error) {
        reject(error)
      }
    })
  }
  stop() {
    this.isStoped = true
    this.outputFinished = true

    this.socket.dispatchEvent(new CustomEvent('stop'))
    this.socket.send(
      JSON.stringify({
        session_id: this.sessionId,
        content: '',
        model: 10001
      })
    )
  }
  polish(content, callbacks) {
    return this.send(`润色以下文本：${content}`, callbacks)
  }
  writing({ fulltext, outputLength = '一句话', content = '', callbacks } = {}) {
    return this.send(`根据内容续写一句话：${content}`, callbacks)
  }
  /**
   * @param {MessageEvent} ev
   */
  handleMessage(ev) {
    if (this.isStoped) {
      return
    }
    if (ev.data === '20000*****FOE*****') {
      this.output = ''
      this.outputFinished = false
      return
    } else if (ev.data === '*****EOF*****') {
      this.outputFinished = true
      return
    }
    this.output += ev.data
  }
}
