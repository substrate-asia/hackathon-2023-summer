import { getAPI, getKeyring } from "../utils/polkadot";
import cache from "../utils/store";

export async function getList(addr) {
  let api = await getAPI();
  let tt = await api.query.hashrateMarket.machine.entries();
  let arr = [];
  tt.forEach(
    ([
      {
        args: [era, nominatorId],
      },
      value,
    ]) => {
      let obj = value.toHuman();
      obj.addr = era.toHuman();
      obj.id = nominatorId.toHuman();
      let metadata = JSON.parse(obj.metadata);
      obj.metadata = metadata;
      obj.TFLOPS = (metadata.InfoFlop?.Flops / 1073741824).toFixed(2);
      if(obj.price){
        obj.price=parseInt(obj.price.split(',').join(''));
      }
      let cpu = metadata.CPUInfos[0];
      if (cpu) {
        obj.AvailableCore = cpu.Cores;
        obj.CPU = cpu.ModelName;
        obj.CPUSpeed = cpu.Mhz / 1000;
        let tmpArr = cpu.ModelName.split(" ");
        let tmp = tmpArr[tmpArr.length - 1];
        if (tmp.indexOf("GHz") != -1) {
          obj.CPUSpeed = tmp;
        }
      }
      if (metadata.GPUInfos && metadata.GPUInfos.length > 0) {
        let gpu = metadata.GPUInfos[0];
        if (gpu) {
          obj.GraphicsCoprocessor = gpu.Model;
        }
      }

      obj.HardDrive =
        parseInt(metadata.DiskInfos[metadata.DiskInfos.length - 1].FreeSpace) +
        " GB";
      arr.push(obj);
    }
  );
  cache.set("machine-list", arr);
  if (addr) {
    console.log("filter addr", addr);
    arr = arr.filter((t) => t.addr == addr);
  }
  return arr;
}
export async function getListFromCache(addr) {
  let arr = cache.get("machine-list");
  if (!arr || arr) {
    arr = await getList();
  }
  if (addr) {
    console.log("filter addr", addr);
    arr = arr.filter((t) => t.addr == addr);
  }
  return arr;
}
export async function getDetail(id) {
  let arr = await getListFromCache();
  return arr.find((t) => t.id == id);
}
