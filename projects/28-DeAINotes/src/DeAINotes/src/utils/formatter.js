import _ from "lodash";
import webconfig from "../webconfig";

export function formatterSize(size) {
  let obj = formatterSize2(size);
  return obj.size + " " + obj.ext;
}
export function formatterSize2(count) {
  if(!count){
    console.log('!count',count);
    return "0 KiB";
  }
  if (_.isString(count)) {
    count = _.toNumber(count);
  }
  if (count === 0) return "0 KiB";
  let k = 1024; 
  let currencyStr = [
    "iB",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ]; //容量单位
  let i = 0; //单位下标和次幂
  for (let l = 0; l < 8; l++) {
    if (count / Math.pow(k, l) < 1) {
      break;
    }
    i = l;
  }
  return {
    size: (count / _.round(Math.pow(k, i))).toFixed(2),
    ext: currencyStr[i],
  };
}
export function formatBalance(balance) {
  if (!balance) {
    return "";
  }
  if (typeof balance == "object" && balance.free) {
    balance = parseInt(balance.free.toString());
  }
  if (isNaN(balance)) {
    return balance;
  }
  return fixed(balance / 1000000000000);
}
export function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}
export function formatAddressLong(addr) {
  if (!addr) return "";
  if (addr.length < 26) return addr;
  return addr.slice(0, 13) + "..." + addr.slice(-13);
}
export function fixed(n) {
  return Math.floor(n * 100) / 100;
}
export function formatTime(time) {
  let h = parseInt((time / 60 / 60) % 24);
  h = h < 10 ? "0" + h : h;
  let m = parseInt((time / 60) % 60);
  m = m < 10 ? "0" + m : m;
  let s = parseInt(time % 60);
  s = s < 10 ? "0" + s : s;
  // return [h, m, s]
  if (h > 0) {
    return h + ":" + m + ":" + s;
  } else {
    return m + ":" + s;
  }
}
export function formatImgUrl(hash) {
  return webconfig.apiUrl + "/video/cover?filename=" + hash;
}
export function formatVideoUrl(hash) {
  return webconfig.videoApiUrl + "/file/" + hash;
}
