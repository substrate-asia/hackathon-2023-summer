import Ajax from './Ajax.js'
// 我的指数详情Api
export function vault_listApi(id) {
  return Ajax('/vault_list')
}
export function vault_detailsApi(id) {
  return Ajax('/vault/' + id)
}
export function getNotificationListApi(address) {
  return Ajax('/vault_notification_list?followerAddress=' + address)
}
