let loadingIntal=null;
const popu = {
  confirm: function (msg,value) {
    return new Promise((resolve, reject) => {
      this.$prompt(null, msg, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal:false,
        inputValue:value
      })
        .then(({ value }) => {
          resolve(value);
        })
        .catch(() => {});
    });
  },
  inputPassword: function (msg,value) {
    return new Promise((resolve, reject) => {
      this.$prompt(null, msg, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal:false,
        inputType:"password"
      })
        .then(({ value }) => {
          resolve(value);
        })
        .catch(() => {});
    });
  },
  ok: function (msg) {
    this.$message({
      type: "success",
      message: msg,
    });
  },
  okR:function(title,msg){
    this.$notify({
      title: title,
      message: msg,
      type: 'success'
    });
  },
  alert: function (msg) {
    this.$message(msg);
  },
  error: function (msg) {
    this.$message.error(msg);
  },
  ask: function (msg) {
    return new Promise((resolve, reject) => {
      this.$confirm(null,msg, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            resolve(true);
        })
        .catch(() => {
            resolve(false);
        });
    });
  },
  loading:function(isShow){
    if(isShow){
      loadingIntal=this.$loading({fullscreen:true});
    }else{
      if(loadingIntal){
        loadingIntal.close();
      }
    }
  }
};
