class DAL {
  constructor(sysconfig) {
    this.sysconfig = sysconfig;
    if (sysconfig.datasource == "cess") {
      this.dal = new CESS(sysconfig);
    }
    else if (sysconfig.datasource == "github") {
      this.dal = new GithubGist(sysconfig);
    }else if (sysconfig.datasource == "api") {
      this.dal = new API(sysconfig);
    } else if (sysconfig.datasource == "localstore") {
      this.dal = new LocalStorage(sysconfig);
    } else {
      console.log(sysconfig.datasource);
      throw "sysconfig.datasource is empty."
    }
    this.cache = {};
  }
  async loadAll() {
    let pageindex = 1;
    let pagesize = 100;
    let currPageCount = 100;
    let arr = [];
    if(this.loading) return;
    this.loading=true;
    while (currPageCount >= pagesize) {
      let ret = await this.dal.list(pageindex, pagesize);
      currPageCount = ret.length;
      for(let t of ret){
        let content=t.content;
        let item=this.treeArr.find(a=>a.id==t.id);
        if(item&&item.isPrivate){
          content=aesDecrypt(content, this.sysconfig.password);
          t.content=content;
        }
        arr.push(t);
        this.cache['content_' + t.id] = content;
      }
      await sleep(100);
      pageindex++;
    }
    this.allList = arr;
    this.loading=false;
  }
  async list(pageindex, pagesize) {
    if (!pageindex) pageindex = 1;
    if (!pagesize) pagesize = 20;
    let ret = await this.dal.list(pageindex, pagesize);
    return ret;
  }
  async setlist(list){
    await this.dal.setlist(list);
  }
  async getTree() {
    let ret = await this.dal.getTree();
    if(ret.msg=='ok'&&ret.data){
      this.bindTreeToObj(ret.data);
    }
    return ret;
  }
  async setTree(tree) {
    this.bindTreeToObj(tree);
    let ret = await this.dal.setTree(tree);
    return ret;
  }
  bindTreeToObj(tree){
    this.tree=tree;
    this.treeArr=treeToArray(tree);
  }
  async detail(id, isPrivate) {
    let content = this.cache['content_' + id];
    if (content) {
      return { msg: 'ok', data: content };
    }
    let ret = await this.dal.detail(id);
    if (ret.msg != 'ok') {
      return null;
    }
    content = ret.data;
    if (content && isPrivate && this.sysconfig.password) {
      let tmp = aesDecrypt(content, this.sysconfig.password);
      if (tmp) {
        content = tmp;
      }
    }
    ret.data = content;
    this.cache['content_' + id] = content;
    return ret;
  }
  async add(title, contentSrc, isPrivate) {
    let content = contentSrc;
    if (isPrivate) {
      content = aesEncrypt(contentSrc, this.sysconfig.password);
    }
    let ret = await this.dal.add(title, content);
    if (ret.msg == 'ok' && ret.id) {
      this.cache['content_' + ret.id] = contentSrc;
    }
    return ret;
  }
  async update(id, title, contentSrc, isPrivate) {
    let content = contentSrc;
    if (isPrivate) {
      content = aesEncrypt(contentSrc, this.sysconfig.password);
    }
    let ret = await this.dal.update(id, title, content);
    this.cache['content_' + id] = contentSrc;
    return ret;
  }
  async del(id) {
    let ret = await this.dal.del(id);
    if (ret.msg == 'ok') {
      delete this.cache['content_' + id];
    }
    return ret;
  }
}
