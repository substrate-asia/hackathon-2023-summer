class CESS {
  constructor(sysconfig) {
    this.sysconfig = sysconfig;
    this.arr = cache.get("content-list") || [];
  }
  async list(pageindex, pagesize) {
    return this.arr;
  }
  async setlist(contetns) {
    this.arr = contetns;
    cache.set("content-list", this.arr);
  }
  async getTree() {
    return beforeReturn(cache.get("tree") || []);
  }
  async setTree(tree) {
    return beforeReturn(cache.set("tree", tree));
  }
  async detail(id) {
    console.log("id", id);
    let data = this.arr.find((t) => t.id.toString() == id.toString());
    return beforeReturn(data.content);
  }
  async add(title, content) {
    let id = new Date().valueOf();
    let data = {
      id,
      title,
      content,
    };
    this.arr.push(data);
    let ret = beforeReturn(data);
    ret.id = id;
    cache.set("content-list", this.arr);
    return ret;
  }
  async update(id, title, content) {
    let data = this.arr.find((t) => t.id.toString() == id.toString());
    if (data) {
      data.title = title;
      data.content = content;
    }
    cache.set("content-list", this.arr);
    return beforeReturn(data);
  }
  async del(id) {}
}
function beforeReturn(data) {
  return { msg: "ok", data };
}
