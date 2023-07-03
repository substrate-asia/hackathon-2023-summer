let geolocation = null
export function SelfLocation(params) {
  // 浏览器定位
  if (!geolocation) {
    geolocation = new AMap.Geolocation({
      showMarker: true,
      showButton: false,
      enableHighAccuracy: true,
      timeout: 10000,
      zoomToAccuracy: true,
      buttonPosition: 'LT',
      // buttonOffset:new AMap.Pixel(10,20),
    })
  }
  params.map.addControl(geolocation)
  geolocation.getCurrentPosition()
  // if (params.complete && typeof params.complete == 'function') {
  //   AMap.event.addListener(geolocation, 'complete', params.complete) //返回定位信息
  // }
  // if (params.error && typeof params.error == 'function') {
  //   AMap.event.addListener(geolocation, 'error', params.onError) //返回定位出错信息
  // }
}
