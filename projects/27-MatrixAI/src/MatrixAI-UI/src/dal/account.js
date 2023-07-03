import { getAPI, getKeyring } from "../utils/polkadot";
import store from "../utils/store";
import * as util from "../utils";
import { formatBalance } from "../utils/formatter";

export async function refreshBalance() {
  let api = await getAPI();
  let addr = localStorage.getItem("addr");
  let account=store.get("account");
  if(!addr||!account){
    return;
  }
  const { nonce, data: balance } = await api.query.system.account(addr);
  account.nonce = nonce;
  account.balance = formatBalance(balance);
  account.balance_str = account.balance + " MAI";
  store.set("account", account);
  return account;
}

