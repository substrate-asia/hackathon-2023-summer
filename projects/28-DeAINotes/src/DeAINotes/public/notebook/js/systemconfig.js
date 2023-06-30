let systemconfig = {
  get: async function (vue) {
    let sysconfig = localStorage.getItem("sysconfig");
    if (!sysconfig) {
      return null;
    }
    let password = "";
    let tmp = getCookie("password");
    if (tmp) {
      tmp = aesDecrypt(tmp, "clound-notebook");
      if (tmp) {
        password = tmp;
      }
    }
    while (sysconfig.indexOf("{") != 0) {
      if (!password) {
        password = await vue.inputPassword("请输入密码");
      }
      if (!password) {
        vue.error("密码不能为空!");
        continue;
      }
      tmp = aesDecrypt(sysconfig, password);
      if (tmp && tmp.indexOf("{") == 0) {
        sysconfig = tmp;
        setCookie("password", aesEncrypt(password, "clound-notebook"), 7);
      }
    }
    try {
      sysconfig = JSON.parse(sysconfig);
    } catch (e) {
      console.error(e);
      vue.error("配置文件解析出错!");
      return null;
    }
    return sysconfig;
  },
  set: function (v) {
    let str = JSON.stringify(v);
    if (v.password) {
      str = aesEncrypt(str, v.password);
    }
    localStorage.setItem("sysconfig", str);
  },
};
let datasource = {  
  onSaveSysconfig() {
    systemconfig.set(this.sysconfig);
    // this.init();
    this.ok("保存成功！");
    return true;
  },
  onAddDataSource(){
    this.sysconfig.datasource.arr.push(this.newDataSource);
    if(!this.sysconfig.datasource.curr){
      this.sysconfig.datasource.curr=this.newDataSource.name;
    }
    systemconfig.set(this.sysconfig);
    this.init();
    this.isAddingDataSource=false;
    this.ok("添加成功！");
  },
  async onDeleteDataSource() {
    let yes=await this.ask('确定选择数据源删除吗？');
    if(!yes) return;
    let ds = this.sysconfig.datasource;
    let tmp = ds.arr.findIndex((t) => t.name == ds.curr);
    if (tmp != -1) {
      ds.arr.splice(tmp, 1);
    }
    systemconfig.set(this.sysconfig);
    this.init();
    this.ok("删除成功！");
  },
  onTurnDataSource() {    
    systemconfig.set(this.sysconfig);
    this.init();
    this.ok("切换成功！");
  },
};
