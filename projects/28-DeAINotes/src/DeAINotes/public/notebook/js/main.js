let resizeable = false // 是否开启尺寸修改
let panel = null //左面板
let body = null
let dal = null //gitee 代码块
let saveContentTimeout = null
let showOkTimeout = null
let mdthemes = {
  arr: ['github-dark', 'github-light', 'my-dark'],
  index: 0
}
let lastContentBodyMd = ''

var vm = new Vue({
  el: '#app',
  data: {
    isLoading: false,
    isUpChaining: false,
    saveOk: false,
    hasLoadAllDoc: false,
    winWidth: document.body.clientWidth,
    treeDefaultProps: {
      children: 'children',
      label: 'label'
    },
    currTabName: 'doc',
    expandedKeys: [], //默认展开的节点
    tree: null,
    treeContextmenu: {
      visible: false,
      currNode: null, //右键点击的节点
      left: -500,
      top: 0
    },
    editorCtxmenu: {
      visible: false,
      loading: false,
      currNode: null, //右键点击的节点
      selectText: '',
      left: -500,
      top: 0
    },
    currNode: null, //左键点击的当前节点
    currDocNode: null,
    editorType: 'div',
    contentBodyHtml: '',
    contentBodyMd: '',
    contentWidth: '900px',
    dialog: {
      show: false,
      parentNode: null,
      node: {
        label: '',
        isPrivate: false
      },
      isPrivateOld: false
    },
    isAddingDataSource: false,
    newDataSource: {
      name: '',
      datasource: '',
      token: '',
      password: '',
      api: ''
    },
    sysconfig: {
      datasource: {
        arr: [],
        curr: ''
      },
      autoSave: true
    },
    searchKeyword: '',
    upload: {},
    accounts: {
      arr: [],
      curr: ''
    },
    chatgpt: null
  },
  watch: {
    searchKeyword(val) {
      this.$refs.tree2.filter(val)
    },
    'editorCtxmenu.visible'(val) {
      if (!val) {
        this.handleEditorCxtmenuClose()
      }
    }
  },
  mounted: async function () {
    let that = this
    document.getElementById('toploading').style.display = 'none'

    //需要调整尺寸的div
    panel = document.getElementById('panel')
    panel.addEventListener('mousedown', that.onMouseDown)
    let tmp = localStorage.getItem('panel_width')
    if (tmp) {
      panel.style.width = tmp + 'px'
    }
    body = document.getElementById('body')

    this.addBodyEvent(true)
    await this.init()

    document.addEventListener('keydown', function (e) {
      if (
        e.keyCode == 83 &&
        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault() //阻止默认操作
        // console.log("saved");
        that.onSaveDoc()
      }
    })
    document.addEventListener('contextmenu', (e) => {
      this.editorCtxmenu.visible = false
      this.treeContextmenu.visible = false
    })
    document.addEventListener('mousedown', () => {
      this.editorCtxmenu.visible = false
      this.treeContextmenu.visible = false
    })

    window.onbeforeunload = function (e) {
      e = e || window.event
      if (!that.contentBodyMd || that.contentBodyMd == lastContentBodyMd) {
        console.log('未更改1')
        return
      } else {
        that.onSaveDoc()
      }
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = '您是否确认离开此页面-您输入的数据可能不会被保存'
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return '您是否确认离开此页面-您输入的数据可能不会被保存'
    }
    window.addEventListener(
      'message',
      (event) => {
        let res = event.data
        if (res.way && res.msg) {
          if (res.msg != 'ok') {
            return popu.alert(res.msg)
          }
          if (res.way == 'login') {
            that.onLoginOK(res.data)
          }
        }
      },
      { once: false }
    )
  },
  beforeDestroy() {
    this.chatgpt?.close()
  },
  methods: {
    ...popu,
    // ...forAPP,
    ...datasource,
    async onCessLogin() {
      if (!window.top.uploadFile) {
        return console.log('!window.web3Enable')
      }
      let json = {
        txt: '发哥测试' + new Date().valueOf()
      }
      let fileName = 'a.json'
      let url = 'https://d.cess.cloud/' + fileName
      let result = await window.top.uploadFile(url, fileName, json)
      console.log(result)
    },
    showAIInput() {
      this.confirm('Confit chatGPT api token')
    },
    onChangeMarkdownCSS() {
      mdthemes.index++
      if (mdthemes.index > mdthemes.arr.length - 1) {
        mdthemes.index = 0
      }
      let n = mdthemes.arr[mdthemes.index]
      var linkstyle = document.getElementById('themes')
      linkstyle.href = './css/markdown/' + n + '.css'
      console.log(n)
    },
    filterNode(value, data) {
      if (!value || data.label.indexOf(value) != -1) {
        return true
      }
      if (data.type == 'cat') {
        return false
      }
      if (!dal.allList || dal.allList.length == 0) {
        return false
      }
      let item = dal.allList.find((t) => t.id == data.id)
      if (item && item.content.indexOf(value) != -1) {
        return true
      }
      return false
    },
    async onUploadToCESS() {
      this.isUpChaining = true
      let filename = new Date().valueOf() + '.json'
      let apiUrl = 'https://d.cess.cloud/' + filename
      let contents = await dal.list()
      let tree = await dal.getTree()
      let json = {
        contents,
        tree: tree.data
      }
      let result = await this.uploadFile(apiUrl, filename, json)
      result = JSON.parse(result)
      if (result.msg != 'ok' || !result.link) {
        return this.alert(result.msg)
      }
      let url = result.link
      url = url.split('/')[1]
      url = url.split('.')[0]
      localStorage.setItem('bucket-name', url)
      await window.top.createBucket(url)
      this.isUpChaining = false
    },
    async onLoadFromCESS() {
      let bucketName = localStorage.getItem('bucket-name')
      if (!bucketName) {
        let arr = await window.top.myBuckets()
        console.log('myBuckets', arr)
        if (arr.length > 0) {
          bucketName = arr[arr.length - 1]
        }
      }
      if (!bucketName) {
        return this.alert('file name is empty.')
      }
      let filename = bucketName + '.json'
      let apiUrl = 'https://d.cess.cloud/' + filename
      let result = await fetch(apiUrl)
      result = await result.json()
      console.log({ result })
      dal.setTree(result.tree)
      dal.setlist(result.contents)
      this.init()
    },
    uploadFile(apiUrl, filename, json) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([JSON.stringify(json)], { type: 'text/plain' })
        let textFile = new File([blob], filename, { type: 'text/plain' })

        // Add the text file to FormData
        const formData = new FormData()
        formData.append('file', textFile)

        // Upload the file using AJAX
        const xhr = new XMLHttpRequest()
        xhr.open('POST', apiUrl, true)
        xhr.onreadystatechange = function (res, body, t) {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.response)
            resolve(xhr.response)
          } else if (xhr.readyState === 4) {
            reject('File upload failed')
          }
        }
        xhr.send(formData)
      })
    },
    async onLoginOK(password) {
      let p = password.slice(-8)
      console.log('登录成功', password)
      this.newDataSource = {
        name: 'cess',
        datasource: 'cess',
        token: '',
        password: p,
        api: ''
      }
      this.onAddDataSource()
      if (!this.tree || this.tree.length == 0) {
        this.onLoadFromCESS()
      }
    },
    async init() {
      let that = this
      let tmp = await systemconfig.get(this)
      if (!tmp) {
        if (window.top.onShowLoginBox) {
          window.top.onShowLoginBox()
        } else {
          console.log('!window.top.onShowLoginBox')
        }
        this.currTabName = 'user'
        return
      }
      let currDatasource = tmp.datasource?.arr?.find(
        (t) => t.name == tmp.datasource?.curr
      )
      if (!currDatasource) {
        this.alert('请在左侧配置数据源信息')
        this.currTabName = 'user'
        return
      }
      this.sysconfig = tmp
      dal = new DAL(currDatasource)
      this.isLoading = true
      tmp = await dal.getTree()
      this.isLoading = false
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      this.tree = tmp.data
      this.currTabName = 'doc'
      tmp = localStorage.getItem('expanded_key')
      if (tmp) {
        this.expandedKeys = [parseInt(tmp)]
      }
      //
      this.reloadAccounts()
      this.chatgpt = new ChatGPT()
    },
    reloadAccounts() {
      let accounts = window.top.getAccounts()
      console.log({ accounts })
      this.accounts = {
        arr: accounts,
        curr: localStorage.getItem('addr')
      }
    },
    onSwitchAccount() {
      let addr = this.accounts.curr
      let account = this.accounts.arr.find((t) => t.address == addr)
      window.top.onSwitchAccount(account)
    },
    async loadAllDoc() {
      this.isLoading = true
      await dal.loadAll()
      this.isLoading = false
      this.hasLoadAllDoc = true
      this.okR('成功！', '加载全部笔记完成')
    },
    async onAutoSaveDoc() {
      let that = this
      let n = this.currDocNode
      console.log('===========')
      let title = '云笔记-' + n.label
      if (this.contentBodyMd == lastContentBodyMd) {
        document.title = title
      } else {
        document.title = title + '*'
      }
      if (!this.sysconfig.autoSave) {
        return
      }
      clearTimeout(saveContentTimeout)
      saveContentTimeout = setTimeout(function () {
        that.onSaveDoc(true)
      }, 5000)
    },
    async onSaveDoc() {
      let that = this
      clearTimeout(saveContentTimeout)
      let n = this.currNode
      let content = this.contentBodyMd
      if (content == lastContentBodyMd) {
        return console.log('内容未变化，跳过保存')
      }
      lastContentBodyMd = content
      this.isLoading = true
      let tmp = await dal.update(n.id, n.label, content, n.isPrivate)
      this.isLoading = false
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      document.title = '云笔记 - ' + n.label
      // this.okR("成功！", "保存笔记到云端");
      this.saveOk = true
      clearTimeout(showOkTimeout)
      showOkTimeout = setTimeout(function () {
        that.saveOk = false
      }, 6000)
    },
    async onLoadDoc() {
      //加载内容
      this.isLoading = true
      let n = this.currDocNode
      document.title = '云笔记 - ' + n.label
      let tmp = await dal.detail(this.currNode.id, this.currNode.isPrivate)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      let content = tmp.data
      // console.log({ tmp });
      this.isLoading = false
      this.contentBodyMd = content
      lastContentBodyMd = content
      this.contentBodyHtml = this.markRender(content)
    },
    markRender(txt) {
      // console.log('use marked');
      return marked.parse(txt)
      // var md = window.markdownit();
      // var result = md.render(txt);
      // return result;
    },
    async onSaveDocNode() {
      let d = this.dialog
      if (!d.node.label) {
        return console.log('标题为空')
      }
      this.loading(true)
      let id = new Date().valueOf()
      let tmp = ''
      if (d.isAdd) {
        tmp = await dal.add(
          d.node.label,
          '请在此输入笔记内容',
          d.node.isPrivate
        )
        if (tmp.msg != 'ok') {
          return this.error(tmp.msg)
        }
        id = tmp.data.id
        let nodeData = {
          id,
          label: d.node.label,
          children: [],
          type: 'content',
          isPrivate: d.node.isPrivate
        }
        d.parentNode.children.unshift(nodeData)
        this.onNodeClick(nodeData)
        this.$refs.tree2.setCurrentKey(id)
      } else {
        let ret = await dal.detail(d.node.id, d.isPrivateOld)
        if (ret.msg != 'ok') {
          return this.error(ret.msg)
        }
        let content = ret.data
        tmp = await dal.update(
          d.node.id,
          d.node.label,
          content,
          d.node.isPrivate
        )
        if (tmp.msg != 'ok') {
          return this.error(tmp.msg)
        }
      }
      tmp = await dal.setTree(this.tree)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      console.log(tmp)
      this.ok('保存成功!')
      this.dialog.show = false
      this.loading(false)
    },
    async addTree(type, node) {
      let tmp = ''
      console.log(type, node)
      if (type == 'content') {
        this.dialog = {
          show: true,
          isAdd: true,
          parentNode: node,
          node: {
            label: '',
            isPrivate: false
          }
        }
        return
      }
      let msg = type == 'cat' ? '文件夹名称' : '笔记标题'
      let title = await this.confirm('请输入' + msg)
      if (!title) return
      if (!node) {
        node = this.tree
      } else {
        if (node.type == 'content') {
          return this.alert('笔记下不可以创建文件夹或笔记')
        }
        node = node.children
      }
      this.loading(true)
      let id = new Date().valueOf()
      node.unshift({
        id,
        label: title,
        children: [],
        type
      })
      //save
      tmp = await dal.setTree(this.tree)
      this.loading(false)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      this.ok('保存成功!')
    },
    async updateTree(node) {
      let type = node.type
      if (type == 'content') {
        this.dialog = {
          show: true,
          isAdd: false,
          parentNode: node,
          node: node,
          isPrivateOld: node.isPrivate
        }
        return
      }
      let msg = type == 'cat' ? '文件夹名称' : '笔记标题'
      let title = await this.confirm('请输入新的' + msg, node.label)
      if (!title) return
      node.label = title
      //save
      this.loading(true)
      let tmp = await dal.setTree(this.tree)
      this.loading(false)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      this.ok('保存成功!')
    },
    async delTree(node) {
      console.log(node)
      let type = node.type || node.data.type
      let msg = type == 'cat' ? '文件夹:' : '笔记:'
      let yes = await this.ask('确认要删除' + msg + node.label)
      if (!yes) return

      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === node.data.id)
      children.splice(index, 1)
      //save
      this.delNodeFromTree(this.tree, node.data.id)
      console.log(JSON.stringify(this.tree))
      let tmp = await dal.setTree(this.tree)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      if (type == 'content') {
        tmp = await dal.del(node.data.id)
        if (tmp.msg != 'ok') {
          return this.error(tmp.msg)
        }
      }
      this.currNode = null
      this.currDocNode = null
      this.ok('保存成功!')
    },
    async onTreeDrop() {
      let tmp = await dal.setTree(this.tree)
      if (tmp.msg != 'ok') {
        return this.error(tmp.msg)
      }
      this.ok('节点保存成功！')
    },
    delNodeFromTree(nodes, id) {
      let i = nodes.findIndex((t) => t.id == id)
      if (i != -1) {
        return nodes.splice(i, 1)
      }
      if (nodes?.children?.length) {
        this.delNodeFromTree(nodes.children, id)
      }
    },
    onChangeEditor(n) {
      this.editorType = n
      if (n == 'div') {
        this.contentBodyHtml = this.markRender(this.contentBodyMd)
        this.onSaveDoc()
      }
    },
    addBodyEvent(isAdd) {
      let that = this
      if (isAdd) {
        body.addEventListener('mousemove', that.onMouseMove)
        panel.addEventListener('mouseup', that.onMouseUp)
      } else {
        body.removeEventListener('mousemove', that.onMouseMove)
        panel.removeEventListener('mouseup', that.onMouseUp)
      }
    },

    nodeContextmenu(e, data, n, t) {
      e.preventDefault()
      e.stopImmediatePropagation()
      e.stopPropagation()

      this.treeContextmenu.currNode = n
      this.treeContextmenu.left = e.x
      this.treeContextmenu.top = e.y
      this.treeContextmenu.visible = true
    },
    async onNodeClick(data) {
      let that = this
      this.currNode = data
      if (data.type == 'content') {
        // console.log({data})
        await this.onSaveDoc()
        this.currDocNode = data
        await this.onLoadDoc()
        that.resetToolbarWidth()
      } else {
        localStorage.setItem('expanded_key', data.id.toString())
      }
    },
    //#region 笔记内容区上下文菜单逻辑块
    useChatgptResult() {
      try {
        if (!this.chatgpt?.output) {
          return
        }
        const output = this.chatgpt.output
        const selection = window.getSelection()
        const text = selection.toString()
        if (!text) {
          this.contentBodyMd = output
          return
        }
      } catch (error) {
      } finally {
        this.editorCtxmenu.visible = false
      }

      // this.contentBodyMd = this.contentBodyMd.replace(text, this.chatgpt.output)
    },
    copyChatgptResult() {
      this.$copyText(this.chatgpt.output)
        .then(() => {
          this.$message.success('复制成功')
        })
        .finally(() => {
          this.editorCtxmenu.visible = false
        })
    },
    handleEditorCxtmenu(ev) {
      ev.preventDefault()
      ev.stopImmediatePropagation()
      ev.stopPropagation()

      const currSelection = window.getSelection()

      if (this.editorType !== 'textarea') return

      this.editorCtxmenu.currNode = ev.target
      this.editorCtxmenu.left = ev.clientX
      this.editorCtxmenu.top = ev.clientY
      this.editorCtxmenu.visible = true
    },
    async handleEditorCxtmenuItemClick(type) {
      this.editorCtxmenu.loading = true

      const currSelection = window.getSelection()

      const text = currSelection.toString() || this.contentBodyMd

      const callbacks = {
        step: (type, data) => {
          if (type === 'start') {
            this.editorCtxmenu.loading = false
          }
        },
        finish: () => {}
      }
      try {
        let output
        switch (type) {
          case 'polish':
            output = await this.chatgpt.polish(text, callbacks)
            break
          case 'writing':
            output = await this.chatgpt.writing({
              fulltext: this.contentBodyMd,
              content: text,
              callbacks
            })
            break
        }
      } catch (error) {
        this.editorCtxmenu.loading = false
      }
    },
    handleEditorCxtmenuClose() {
      if (!this.chatgpt.outputFinished) {
        this.chatgpt.stop()
      }
      this.chatgpt.output = ''
    },
    //#endregion
    resetToolbarWidth() {
      let that = this
      let w = document.getElementsByClassName('right-content')
      w = w[0].offsetWidth - 8
      that.contentWidth = w + 'px'
    },
    onMouseUp(e) {
      e.preventDefault()

      // if (this.treeContextmenu.left > 10) {
      //   this.treeContextmenu.left = -500
      // }

      if (!resizeable) return
      resizeable = false
      console.log('e.clientX', e.clientX)
      localStorage.setItem('panel_width', e.clientX)
      this.resetToolbarWidth()
    },
    onMouseDown(e) {
      resizeable = this.getDirection(e)
    },
    onMouseMove(e) {
      let d = this.getDirection(e)
      panel.style.cursor = d ? 'e-resize' : 'default'
      if (resizeable) {
        panel.style.width = e.clientX + 'px'
      }
    },
    onToolbarClick(e, start, end) {
      const selection = window.getSelection()
      const selectTxt = selection.toString()
      let startIndex = 0
      let endIndex = 0
      let content = this.contentBodyMd
      if (this.editorType == 'div') {
        if (!selectTxt) {
          return this.alert('请选择一段文字')
        }
        startIndex = content.indexOf(selectTxt)
        endIndex = startIndex + selectTxt.length + 1
      } else {
        let ele = document.getElementById('contentBodyInput')
        startIndex = ele.selectionStart
        endIndex = ele.selectionEnd + 1
      }
      if (start && endIndex && endIndex > startIndex && selectTxt) {
        content = replacepos(
          content,
          startIndex,
          endIndex,
          start + selectTxt + end
        )
      } else {
        content += '\n\n' + e
      }
      this.contentBodyMd = content
      if (this.editorType == 'div') {
        this.contentBodyHtml = this.markRender(content)
      }
      this.onSaveDoc()
    },
    getDirection(ev) {
      return ev.offsetX > panel.offsetWidth - 10 ? true : false
    },
    async onClearCache() {
      let yes = await this.ask('你确定要清除缓存吗？')
      if (yes) {
        localStorage.clear()
        this.ok('清除完成！,2秒后将自动刷新页面')
        window.location.reload()
      }
    },
    onPreview(file) {
      copyToClipboard(file.response.data[0])
      this.ok('文件路径已经复制到剪切板')
    },
    toTop() {
      console.log('fdsa')
    },
    toBottom() {}
  }
})
