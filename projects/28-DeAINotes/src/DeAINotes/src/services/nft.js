import { request } from "../utils";

export function create(data) {
  return request.put("/nft/create", { data });
}
export function nftList() {
  let data = {
    pageindex:1,
    pagesize: 10000,
  };
  return request.put("/video/list", { data });
}
export function search(keyword) {
  let data = {
    key: keyword,
    type: "name",
    pageindex: 1,
    pagesize: 100,
  };
  return request.put("/video/search", { data });
}
export function activityList() {
  let data = {
    pageindex:1,
    pagesize: 10000,
  };
  return request.put("/nft/activity/list", { data });
}
export function transfer(data) {
  return request.put("/nft/transfer/update", { data });
}
export function changeStatus(data) {
  return request.put("/nft/change/status/update", { data });
}
export function nftMint(data) {
  return request.put("/nft/mint/update", { data });
}
export function nftBuy(data) {
  return request.put("/nft/purchase/update", { data });
}
export function addViews(filehash) {
  return request.get("/video/views?filehash="+filehash);
}
