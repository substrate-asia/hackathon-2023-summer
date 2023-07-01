class GithubGist {
  constructor(sysconfig) {
    this.token = sysconfig.token;
  }
  async list(pageindex, pagesize) {
    return await this.beforeRetrurn(this._list, false);
  }
  async getTree() {
    let tmp = "";
    let ret = await this.beforeRetrurn(this._list, true);
    if (ret.data.length == 0) {
      tmp = await this._add(this, "tree", "[]");
      this.treeId = tmp.id;
      if (!tmp.id) {
        console.log(tmp);
        return alert("no id");
      }
      await this._setStar(this, this.treeId);
      ret.data = [];
      return ret;
    }
    tmp = ret.data[0];
    this.treeId = tmp.id;
    tmp = await this._detail(this, tmp.id);
    tmp = tmp.files["content.md"].content;
    if (!tmp) {
      ret.data = [];
      return ret;
    }
    ret.data = JSON.parse(tmp);
    return ret;
  }
  async setTree(tree) {
    let ret = { msg: "ok" };
    try {
      if (!this.treeId) {
        ret.msg = "出错了，请刷新";
        return ret;
      }
      let tmp = JSON.stringify(tree);
      ret = await this.update(this.treeId, "tree", tmp);
    } catch (e) {
      ret.msg = e.message;
    }
    return ret;
  }
  async detail(id) {
    let ret= await this.beforeRetrurn(this._detail, id);
    if(ret.msg!='ok') return ret;
    ret.data=ret.data.files["content.md"].content;
    return ret;
  }
  async add(title, content) {
    let ret = await this.beforeRetrurn(this._add, title, content);
    if (ret.msg == "ok" && ret.data.id) {
      ret.id = ret.data.id;
    }
    return ret;
  }
  async update(id, title, content) {
    return await this.beforeRetrurn(this._update, id, title, content);
  }
  async del(id) {
    let ret = await this.beforeRetrurn(this._del, id);
    if (ret.msg == "ok" && ret.data === false) {
      ret.msg = "fail";
    }
    return ret;
  }
  beforeRetrurn(fun, ...params) {
    let that = this;
    params.unshift(that);
    return new Promise(async (resolve, reject) => {
      let ret = { msg: "ok" };
      try {
        ret.data = await fun(...params);
      } catch (e) {
        console.log(e);
        ret.msg = e.message;
      }
      resolve(ret);
    });
  }
  async _list(that, isStar) {
    console.log({ that, isStar });
    let url = "https://api.github.com/gists";
    if (isStar) {
      url += "/starred";
    }
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${that.token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  async _add(that, title, content) {
    const files = {
      "content.md": {
        content,
      },
    };
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${that.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: title,
        public: false,
        files,
      }),
    });
    const data = await response.json();
    return data;
  }
  async _update(that, gistId, title, content) {
    const files = {
      "content.md": {
        content,
      },
    };
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${that.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: title,
        files,
      }),
    });
    const data = await response.json();
    return data;
  }
  async _del(that, gistId) {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "DELETE",
      headers: {
        Authorization: `token ${that.token}`,
      },
    });
    return response.status === 204;
  }
  async _detail(that, gistId) {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${that.token}`,
      },
    });
    const data = await response.json();
    return data;
  }
  async _setStar(that, gistId) {
    const response = await fetch(
      `https://api.github.com/gists/${gistId}/star`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${that.token}`,
        },
      }
    );
    return response.status === 204;
  }
}
