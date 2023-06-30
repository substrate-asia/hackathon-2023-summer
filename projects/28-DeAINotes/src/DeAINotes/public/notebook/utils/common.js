function strTrim(str) {
  str = str.replace(/(^\s*)|(\s*$)/g, "");
  return str;
}
function sleep(minisec, showLog) {
  return new Promise((resolve, reject) => {
    if (showLog) {
      console.log(
        moment().format("YYYY-MM-DD HH:mm"),
        "暂停" + (minisec / 1000).toString() + "秒."
      );
    }
    setTimeout(function () {
      resolve();
    }, minisec);
  });
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (typeof callback != "undefined") {
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function () {
        callback();
      };
    }
  }
  script.src = url;
  document.body.appendChild(script);
}
function isEmpty(value) {
  var result = false;
  console.log(typeof value);
  switch (typeof value) {
    case "string":
      result = value == "";
      break;
    case "undefined":
      result = true;
      break;
    case "number":
      result = false;
      break;
    case "object":
      var tmp = JSON.stringify(value);
      result = tmp == "{}" || tmp == "[]" ? true : false;
      break;
  }
  return result;
}
function treeToArray(tree) {
  let tree2 = JSON.parse(JSON.stringify(tree));
  let reArray = [];
  function getChildren(arr, pid) {
    arr.forEach((t) => {
      t.pid = pid;
      let tmp = t.children;
      reArray.push(t);
      if (tmp && Array.isArray(tmp) && tmp.length > 0) {
        getChildren(tmp, t.id);
      }
    });
  }
  getChildren(tree2, 0);
  reArray.forEach((t) => {
    delete t.children;
  });
  return reArray;
}
function arrayToTree(arr) {
  let arr2 = JSON.parse(JSON.stringify(arr));
  let reTree = arr2.filter((t) => t.pid == 0);
  function getChildren(list) {
    list.forEach((t) => {
      t.children = arr2.filter((a) => a.pid == t.id);
      if (t.children.length) {
        getChildren(t.children);
      }
    });
  }
  getChildren(reTree);
  return reTree;
}
function ajax(url, params, method) {
  return new Promise((resolve, reject) => {
    let p = {
      type: method ? method : params ? "POST" : "GET",
      url: url,
      success: function (str) {
        if (str && typeof str == "string") {
          str = JSON.parse(str);
        }
        resolve(str);
      },
      error: function (e) {
        reject(e);
      },
    };
    if (params) {
      p.data = params;
    }
    $.ajax(p);
  });
}
function md5(txt) {
  return CryptoJS.MD5(txt).toString();
}
function aesEncrypt(txt, secret) {
  let ciphertext = CryptoJS.AES.encrypt(txt, secret).toString();
  //   console.log("ciphertext", ciphertext);
  return ciphertext;
}
function aesDecrypt(txt, secret) {
  var bytes = CryptoJS.AES.decrypt(txt, secret);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  //   console.log("originalText", originalText);
  return originalText;
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
const cache = {
  get: function (key) {
    let tmp = localStorage.getItem(key);
    if (tmp) {
      tmp = JSON.parse(tmp);
      return tmp.v;
    }
    return null;
  },
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify({ v: value }));
  },
  del: function (key) {
    localStorage.removeItem(key);
  },
};
function replacepos(text,start,stop,replacetext){
  mystr = text.substring(0,start)+replacetext+text.substring(stop-1);
  return mystr;
}