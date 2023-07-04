import Vue from 'vue'

// 高德离线地图
// import VueAMap from 'vue-amap'
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
// import { lazyAMapApiLoaderInstance } from '@vuemap/vue-amap'
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  // 高德key
  // key: '26e0972bd9c347acbb17157bf0b1bf92',
  key: '966044df467348180e9bc1276a7f7d2f',
  version: '2.0',
  // 插件集合 （插件按需引入）
  plugins: [
    'AMap.Geolocation',
    'AMap.Walking',
    'AMap.MapType',
    'AMap.MarkerCluster',
    'AMap.AutoComplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Weather',
  ],

  // Loca: {
  //   // 是否加载 Loca， 缺省不加载
  //   version: '2.0.0', // Loca 版本，缺省 1.3.2
  // },
})
// for the new version of AMAP, we must include the securityJsCode, or the poi will be wrong
window._AMapSecurityConfig = {
  securityJsCode: 'aa6935254da67f77412663214c4bff37',
}
