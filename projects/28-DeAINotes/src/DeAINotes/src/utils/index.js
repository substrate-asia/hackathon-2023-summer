import request from "./request";
import { Modal, message, notification } from "antd";
import clipboard from "copy-to-clipboard";

export {
  request,
  formatAddress,
  alert,
  alertP,
  showOK,
  confirm,
  loading,
  formdataify,
  copy
};
function copy(text){
  clipboard(text);
  showOK("Copy successful !");
}
function formatAddress(addr) {
  if (!addr) return "";
  if (addr.length < 10) return addr;
  return addr.slice(0, 5) + "..." + addr.slice(-5);
}
function alert(msg, cb) {
  Modal.info({
    title: msg,
    onOk: cb,
  });
}
function alertP(msg) {
  return new Promise((resolve, reject) => {
    Modal.info({
      title: msg,
      onOk: resolve,
    });
  });
}
function showOK(content) {
  // message.success(content);
  notification.success({
    description:content,
    placement:"bottomRight"
  });
}

function confirm(content) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content: content,
      okText: "OK",
      cancelText: "Cancel",
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

function loading(show, txt) {
  if (!show) {
    return message.destroy();
  }
  message.loading({
    content: txt || "loading...",
    duration: 0,
    style: { marginTop: "200px" },
  });
}
function formdataify(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (typeof params[key] == "object") {
      formData.append(key, JSON.stringify(params[key]));
    } else {
      formData.append(key, params[key]);
    }
  });
  return formData;
}
