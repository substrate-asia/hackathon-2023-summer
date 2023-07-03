class GiteeGist {
  constructor(sysconfig) {
    this.token = sysconfig.token;
    this.baseUrl = "https://gitee.com/api/v5/gists";
  }
  async list(pageindex, pagesize) {
    let ret = { msg: 'ok', data: [] };
    try {
      if (!pageindex) pageindex = 1;
      if (!pagesize) pagesize = 20;
      let url =
        this.baseUrl +
        "?access_token=" +
        this.token +
        "&page=" +
        pageindex +
        "&per_page=" +
        pagesize;
      let json = await ajax(url);
      ret.data = json;
      let arr = [];
      json.forEach(t => {
        let id = t.id;
        let content = t.files["content.md"].content;
        let title = t.description;
        if (title != 'tree') {
          arr.push({
            id, title, content
          });
        }
      });
      ret.data = arr;
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async getTree() {
    let ret = { msg: 'ok', data: [] };
    try {
      let tmp = "";
      let url =
        this.baseUrl +
        "/starred" +
        "?access_token=" +
        this.token +
        "&page=1&per_page=1";
      let list = await ajax(url);
      if (list.length == 0) {
        tmp = await this.add("tree", "[]");
        url = this.baseUrl + "/" + tmp.id + "/star?access_token=" + this.token;
        await ajax(url, null, "PUT");
        this.treeId = tmp.id;
        return ret;
      }
      tmp = list[0];
      this.treeId = tmp.id;
      tmp = tmp.files["content.md"].content;
      if (!tmp) {
        return ret;
      }
      ret.data = JSON.parse(tmp);
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async setTree(tree) {
    let ret = { msg: 'ok' };
    try {
      if (!this.treeId) {
        ret.msg = '出错了，请刷新';
        return ret;
      }
      let tmp = JSON.stringify(tree);
      ret.data = await this.update(this.treeId, 'tree', tmp);
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async detail(id) {
    let ret = { msg: 'ok', id, data: null };
    try {
      let url = this.baseUrl + "/" + id + "?access_token=" + this.token;
      let json = await ajax(url);
      let tmp = json.files['content.md'];
      if (!tmp) {
        ret.msg = '文件不存在';
        return ret;
      }
      ret.data = tmp.content;
      ret.msg = ret.data ? 'ok' : 'fail';
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async add(title, content) {
    let ret = { msg: 'ok' };
    try {
      let that = this;
      let url = this.baseUrl;
      let entity = {
        access_token: that.token,
        files: { "content.md": { content } },
        description: title,
        public: "false",
      };
      ret.data = await ajax(url, entity);
      if(ret.data.id){
        ret.id=ret.data.id;
      }
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async update(id, title, content) {
    let ret = { msg: 'ok' };
    try {
      let that = this;
      let url = this.baseUrl + "/" + id;
      let entity = {
        access_token: that.token,
        files: { "content.md": { content } },
        description: title,
        public: "false",
      };
      ret.data = await ajax(url, entity, 'PATCH');
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async del(id) {
    let ret = { msg: 'ok' };
    try {
      let url = this.baseUrl + "/" + id + "?access_token=" + this.token;
      ret.data = await ajax(url, null, "DELETE");
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
}
