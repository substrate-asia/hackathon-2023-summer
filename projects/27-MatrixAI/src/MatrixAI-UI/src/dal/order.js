import { getAPI, getKeyring } from "../utils/polkadot";
import cache from "../utils/store";
import * as util from "../utils";
import { refreshBalance } from "./account";
import moment from "moment";
import { getList } from "./machine";

import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";

export async function placeOrder(machineInfo, formData, total, cb) {
  let orderId = new Date().valueOf();
  orderId = "999" + orderId.toString();
  let seller = machineInfo.addr;
  let machineId = machineInfo.id;
  formData.buyTime = moment().format("YYYY-MM-DD HH:mm:ss");
  formData.price = machineInfo.price;
  let metadata = JSON.stringify(formData);
  util.loading(true);
  let api = await getAPI();
  let addr = localStorage.getItem("addr");
  await web3Enable("my cool dapp");
  const injector = await web3FromAddress(addr);
  api.tx.hashrateMarket
    .placeOrder(orderId, seller, machineId, metadata, total)
    .signAndSend(
      addr,
      { signer: injector.signer },
      (status) => {
        console.log("status****", status);
        try {
          console.log("status.status.toJSON()", status.status.toJSON());
          console.log("isFinalized", status.isFinalized);
          if (status.isFinalized) {
            //ok
            util.loading(false);
            util.showOK("Place order success!");
            refreshBalance();
            cb(true);
          }
        } catch (e) {
          util.alert(e.message);
          util.loading(false);
          cb(false);
        }
      },
      (e) => {
        console.log("===========", e);
        cb(false);
      }
    )
    .then(
      (t) => console.log,
      (ee) => {
        util.loading(false);
        // setBuySpacing(false);
      }
    );
}
function formatUrl(url) {
  if (!url) return url;
  if (url.indexOf("http") == -1) {
    url = "http://" + url;
  }
  return url;
}
export async function getOrderList(addr) {
  let machineList = await getList();
  let addrMy = localStorage.getItem("addr");
  let api = await getAPI();
  let tt = await api.query.hashrateMarket.order.entries();
  let arr = [];
  tt.forEach(
    ([
      {
        args: [era],
      },
      value,
    ]) => {
      let obj = value.toHuman();
      obj.id = era.toHuman();
      try {
        obj.metadata = JSON.parse(obj.metadata);
        if (!obj.metadata.buyTime) {
          obj.metadata.buyTime = moment().format("YYYY-MM-DD HH:mm:ss");
        }
        if (obj.metadata.completeTime) {
          obj.metadata.completeTime = moment
            .unix(obj.metadata.completeTime)
            .format("YYYY-MM-DD HH:mm:ss");
        }
        obj.metadata.modelUrl = formatUrl(obj.metadata.modelUrl);
        obj.metadata.dataUrl = formatUrl(obj.metadata.dataUrl);
      } catch (e) {}
      obj.total = parseFloat(obj.total);
      obj.machine = machineList.find((m) => m.id == obj.machineId);
      let p = obj.buyer == addrMy ? "- " : "+ ";
      obj.totalStr = p + obj.total;
      arr.push(obj);
    }
  );
  arr.sort((t1, t2) => t2.id - t1.id);
  cache.set("order-list", arr);
  if (addr) {
    arr = arr.filter((t) => t.buyer == addr || t.seller == addr);
  }
  return arr;
}
export async function getOrderListFromCache(addr) {
  let arr = cache.get("order-list");
  if (!arr || arr) {
    arr = await getOrderList();
  }
  if (addr) {
    console.log("filter addr", addr);
    arr = arr.filter((t) => t.addr == addr);
  }
  return arr;
}
export async function getDetail(id) {
  let arr = await getOrderListFromCache();
  return arr.find((t) => t.id == id);
}
