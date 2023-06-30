class LocalStorage {
  constructor(sysconfig) {
    this.sysconfig = sysconfig;
    this.list = cache.get("content-list") || [];
  }
  async list(pageindex, pagesize) {
    return this.list;
  }
  async getTree() {
    return beforeReturn(cache.get("tree") || []);
  }
  async setTree(tree) {
    return beforeReturn(cache.set("tree", tree));
  }
  async detail(id) {
    console.log("id", id);
    let data = this.list.find((t) => t.id.toString() == id.toString());
    return beforeReturn(data.content);
  }
  async add(title, content) {
    let id = new Date().valueOf();
    let data = {
      id,
      title,
      content,
    };
    this.list.push(data);
    let ret = beforeReturn(data);
    ret.id = id;
    cache.set("content-list", this.list);
    return ret;
  }
  async update(id, title, content) {
    let data = this.list.find((t) => t.id.toString() == id.toString());
    if (data) {
      data.title = title;
      data.content = content;
    }
    cache.set("content-list", this.list);
    return beforeReturn(data);
  }
  async del(id) {}
}
function beforeReturn(data) {
  return { msg: "ok", data };
}
