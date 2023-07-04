import {
  create,
  nftList,
  activityList,
  transfer,
  changeStatus,
  nftMint,
  nftBuy,
} from "../services/nft";
import * as util from "../utils";
import {
  contractMint,
  contractAsk,
  contractTransfer,
  contractBuy,
  contractCancel,
} from "../services/contract/index";
import { formatImgUrl, formatterSize, formatAddress } from "../utils/formatter";
import { formatVideoUrl, formatBalance } from "../utils/formatter";

export async function controlGetList(setFun, keyword,isSelling) {
  util.loading(true);
  let result = await nftList();
  util.loading(false);
  if (result.error) {
    util.alert(result.error);
    return null;
  }
  let items = result.ok.list.reverse();
  if(isSelling){
    items=items.filter(t=>t.nftStatus&&t.nftStatus=='List');
  }
  items.forEach((t, i) => {
    t.key = i;
    t.price = formatBalance(t.price);
    t.coverImg = formatImgUrl(t.coverImg);
    t.size_str = formatterSize(t.size);
  });
  if (keyword) {
    items = items.filter(
      (t) =>
        t.fileName.indexOf(keyword) != -1 ||
        t.description.indexOf(keyword) != -1
    );
  }
  if (setFun) {
    setFun(items);
  }
  return items;
}
export async function controlGetOneList(fileHash, setFun) {
  let list = await controlGetList();
  let item = list.find((t) => t.fileHash == fileHash);
  if (setFun) {
    setFun(item);
  }
  return item;
}
export async function controlGetActivityList(setFun) {
  util.loading(true);
  let result = await activityList();
  util.loading(false);
  if (result.error) {
    util.alert(result.error);
    return null;
  }
  let items = result.ok.list.reverse();
  items.forEach((t, i) => {
    t.key = i;
    t.fileHashSort = formatAddress(t.fileHash);
    t.fromSort = formatAddress(t.from);
    t.toSort = formatAddress(t.to);
    t.price = formatBalance(t.price);
  });
  if (setFun) {
    setFun(items);
  }
  return items;
}
export async function controlTransfer(fileHash, toAddr) {
  let fromAddr = localStorage.getItem("addr");
  if (!toAddr) {
    util.alert("Recipient address is empty.");
    return false;
  }
  if (fromAddr == toAddr) {
    util.alert("You can't transfer it to yourself");
    return false;
  }
  util.loading(true);
  let txHash = await contractTransfer(toAddr, fileHash, function (status) {
    util.loading(false);
    util.loading(true, "Curr status：" + status);
  });
  util.loading(false);
  if (!txHash) {
    util.alert("Transfer contract return fail.");
    return false;
  }
  let data = {
    filehash: fileHash,
    to: toAddr,
    txhash: txHash,
  };
  let result = await transfer(data);
  if (result.ok) {
    await util.alertP("Transfer NFT success.");
    return true;
  } else {
    util.alert(result.error.message);
    return false;
  }
}
export async function controlMint(fileHash) {
  util.loading(true);
  let txHash = await contractMint(fileHash, function (status) {
    util.loading(false);
    util.loading(true, "Curr status：" + status);
  });
  let data = {
    filehash: fileHash,
    txhash: txHash,
    token: fileHash,
  };
  let result = await nftMint(data);
  console.log(result);
  util.loading(false);
  if (result.ok) {
    util.alert("Mint success.");
    return true;
  } else {
    util.alert(result.error);
    return false;
  }
}
export async function controlBuy(fileHash, price) {
  let myAddr = localStorage.getItem("addr");
  price = parseFloat(price) * 1000000000000;
  util.loading(true);
  let txHash = await contractBuy(fileHash, price, function (status) {
    util.loading(false);
    util.loading(true, "Curr status：" + status);
  });
  let data = {
    filehash: fileHash,
    to: myAddr,
    txhash: txHash,
  };
  let result = await nftBuy(data);
  console.log(result);
  util.loading(false);
  if (result.ok) {
    util.alert("Buy NFT success.");
    return true;
  } else {
    util.alert(result.error);
    return false;
  }
}
export async function controlCancel(fileHash) {
  util.loading(true);
  let txhash = await contractCancel(fileHash, function (status) {
    util.loading(false);
    util.loading(true, "Curr status：" + status);
  });
  let data = {
    filehash: fileHash,
    status: "unlist",
    txhash,
  };
  let result = await changeStatus(data);
  console.log(result);
  util.loading(false);
  if (result.ok) {
    util.alert("Cancel list success.");
    return true;
  } else {
    util.alert(result.error);
    return false;
  }
}
