class API {
  constructor(sysconfig) {
    this.token = sysconfig.token;
    this.api = sysconfig.api;
    // console.log({ sysconfig });
  }
  async ajax(params) {
    params.token = this.token;
    let res = await ajax(this.api, params);
    return res;
  }
  async getTree() {
    let params = {
      way: "tree",
      action: "getTree",
    };
    return await this.ajax(params);
  }
  async setTree(tree) {
    let params = {
      way: "tree",
      action: "setTree",
      tree: JSON.stringify(tree),
    };
    return await this.ajax(params);
  }
  async list(pageindex, pagesize) {
    let params = {
      way: "content",
      action: "list",
      pageindex,
      pagesize,
    };
    return await this.ajax(params);
  }
  async detail(id) {
    let params = {
      way: "content",
      action: "detail",
      id,
    };
    let ret = await this.ajax(params);
    if (ret.msg == "ok") {
      ret.data = ret.data.content;
    }
    return ret;
  }
  async add(title, content) {
    let params = {
      way: "content",
      action: "add",
      title,
      content,
    };
    return await this.ajax(params);
  }
  async update(id, title, content) {
    let params = {
      way: "content",
      action: "update",
      id,
      title,
      content,
    };
    return await this.ajax(params);
  }
  async del(id) {
    let params = {
      way: "content",
      action: "del",
      id,
    };
    return await this.ajax(params);
  }
}
