<template>
  <div class="amap-wrap">
    <el-amap
      ref="map"
      vid="amapContainer"
      :center="center"
      :zoom="zoom"
      view-mode="2D"
      class="amap-demo"
      @init="initMap"
      @click="clickMap"
      @complete="initMapComplete"
    >
      <!-- browser location-->
      <el-amap-control-geolocation
        ref="location"
        :zoom-to-accuracy="true"
        :pan-to-location="true"
        :convert="true"
        position="LT"
        :offset="[5, 5]"
        extensions="all"
        @complete="getLocation"
      ></el-amap-control-geolocation>

      <!-- marker-cluster -->
      <el-amap-marker-cluster
        ref="cluster"
        :visible="visible"
        :points="addrs"
        @init="markerInit"
        @click="clickMarker"
      ></el-amap-marker-cluster>

      <!-- poi search -->
      <el-amap-search-box
        ref="search"
        :visible="visible"
        @select="selectPoi"
        @choose="choosePoi"
      ></el-amap-search-box>

      <!-- 地图类型 -->
      <el-amap-control-map-type></el-amap-control-map-type>

      <!-- 操作工具条 -->
      <el-amap-control-tool-bar></el-amap-control-tool-bar>

      <!-- 比例尺 -->
      <el-amap-control-scale :visible="visible"></el-amap-control-scale>

      <!-- 覆盖物圆: 搜索结果 -->
      <el-amap-circle-marker
        :center="poi.location"
        @click="
          (e) => {
            clickpoi(poi, e)
          }
        "
      ></el-amap-circle-marker>
    </el-amap>
  </div>
</template>

<script>
  // import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
  // import VueAMap from '@vuemap/vue-amap'
  // import { lazyAMapApiLoaderInstance } from '@vuemap/vue-amap'
  // import { SelfLocation } from './location'
  // import { Walking } from './walking'
  // import StyleCss from './style'
  import '@/plugins/aMap'
  // let amapManager = new AMapManager()

  // import AMapLoader from '@amap/amap-jsapi-loader'

  export default {
    name: 'Map',
    props: {
      addrs: {
        type: Array,
        default: () => [
          {
            id: 1,
            content: '',
            position: [],
            offset: [],
          },
        ],
      },
    },

    data() {
      const _this = this
      return {
        // map: null,

        // map attribute
        center: [116.127808, 30.173239],
        zoom: 12,
        self_lng: '',
        self_lat: '',

        circles: [],
        // 停车场位置
        imgsData: {},
        // 停车场信息
        imgsInfo: [],
        visible: true,
        points: [
          {
            img: 434,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '台州市',
            district: '临海市',
            lnglat: [121.518013, 28.72691],
          },
          {
            img: 433,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '台州市',
            district: '临海市',
            lnglat: [121.494125, 28.763201],
          },
          {
            img: 425,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '慈溪市',
            lnglat: [121.135696, 30.182755],
          },
          {
            img: 424,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '慈溪市',
            lnglat: [121.137001, 30.183302],
          },
          {
            img: 423,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '慈溪市',
            lnglat: [121.137497, 30.183186],
          },
          {
            img: 422,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '慈溪市',
            lnglat: [121.135841, 30.182697],
          },
          {
            img: 421,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '慈溪市',
            lnglat: [121.135918, 30.18256],
          },
          {
            img: 420,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '台州市',
            district: '临海市',
            lnglat: [121.518112, 28.726913],
          },
          {
            img: 419,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '台州市',
            district: '临海市',
            lnglat: [121.517967, 28.726881],
          },
          {
            img: 405,
            is_located: true,
            country: '中国',
            province: '浙江省',
            city: '宁波市',
            district: '余姚市',
            lnglat: [121.133333, 30.166667],
          },
        ], // cluster marker points
        auto: null,
        searchPlaceInput: '',

        placeSearch: null, // poi search instance
        poi: {
          location: [116.127808, 30.173239],
          district: '',
          name: '',
          typecode: '',
        },
      }
    },
    watch: {},
    mounted() {
      // lazyAMapApiLoaderInstance.then(() => {
      //   // your code ...
      //   new AMap.Map('amapContainer', {
      //     center: new AMap.LngLat(121.127808, 30.173239),
      //     zoom: this.zoom,
      //   })
      // })
    },
    beforeDestroy() {
      console.log('beforeDestroy')
      // 销毁地图，并清空地图容器
      this.map.destroy()
    },
    methods: {
      // map functions
      clickMap(e) {
        // console.log('click map :', e)
        console.log('click map :', e.lnglat.lng, e.lnglat.lat)
        // this.map.setCenter([e.lnglat.lng, e.lnglat.lat])
        this.center = [e.lnglat.lng, e.lnglat.lat]
        this.poi.location = [e.lnglat.lng, e.lnglat.lat]
        this.$store.commit('map/setSwiper', false)
        console.log(this.$store.state.map.isShowSwiper)
      },
      initMap(map) {
        console.log('init map: ', map)
        this.map = this.$refs.map.$$getInstance()
        // this.map.on('complete', this.initMapComplete)
      },
      initMapComplete() {
        // 地图图块加载完成后触发
        console.log('finish loading the map ')
        let geolocation = this.$refs.location.$$getInstance()
        geolocation.getCurrentPosition(this.onLocationComplete)

        // call the father component function
        this.$emit('callbackComponent', {
          function: 'loadMap',
        })
      },

      // location functions
      onLocationComplete(status, result) {
        console.log('onLocationComplete: ')
        if (status == 'complete') {
          this.onLocationSuccess(result)
        } else {
          this.onLocationError(result)
        }
      },
      onLocationSuccess(e) {
        var str = []
        console.log('=====================onLocationSuccess', e)
        console.log('getLocation: ', e.position.lat, e.position.lng)
        str.push('定位结果：' + e.position)
        str.push('定位类别：' + e.location_type)
        if (e.accuracy) {
          str.push('精度：' + e.accuracy + ' 米')
        } //如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (e.isConverted ? '是' : '否'))
        console.log(str)
        this.lat = e.position.lat
        this.lng = e.position.lng
      },
      onLocationError(e) {
        var str = []
        str.push(
          '失败原因排查信息' +
            e.message +
            '</br>浏览器返回信息：' +
            e.originMessage
        )
        console.log(str)
      },
      getLocation(e) {
        // this function is similar with onLocationSuccess, the object is same
        console.log('=====================getLocation', e)
        console.log('getLocation: ', e.position.lat, e.position.lng)
        this.lat = e.position.lat
        this.lng = e.position.lng
      },

      // marker fuctions
      markerInit(e) {
        console.log('marker init: ', e)
      },
      clickMarker(e) {
        console.log('marker click: ', e)
        // this.map.setZoom(5)
        let lng = e.lnglat.lng
        let lat = e.lnglat.lat

        console.log('cluster center:', lng, lat)

        var lngMin = 360
        var lngMax = 0
        var latMin = 90
        var latMax = 0
        e.clusterData.forEach((element) => {
          console.log(element.lnglat.lng, element.lnglat.lat)

          if (element.lnglat.lng > lngMax) {
            lngMax = element.lnglat.lng
          }
          if (element.lnglat.lng < lngMin) {
            lngMin = element.lnglat.lng
          }
          if (element.lnglat.lat > latMax) {
            latMax = element.lnglat.lat
          }
          if (element.lnglat.lat < latMin) {
            latMin = element.lnglat.lat
          }
        })
        console.log('lng range is: ', lngMin, lngMax)
        console.log('lat range is: ', latMin, latMax)
        this.$store.commit('map/setSwiper', true)
        console.log(this.$store.state.map.isShowSwiper)

        var imgQuery = this.$store.state.img.queryForm
        imgQuery.address__longitude__range = `${lngMin},${lngMax}`
        imgQuery.address__latitude__range = `${latMin},${latMax}`
        this.$store.commit('img/setQuery', imgQuery)

        // call the father component function
        this.$emit('callbackComponent', {
          function: 'loadImg',
          data: imgQuery,
        })
      },

      // poi fuctions
      selectPoi(e) {
        console.log('selectPoi: ', e)
        if (this.placeSearch !== null) {
          this.placeSearch.clear()
        } //构造地点查询类

        this.zoom = 18
        this.center = [e.poi.location.lng, e.poi.location.lat]
        this.poi.location = [e.poi.location.lng, e.poi.location.lat]
        this.poi.district = e.poi.district
        this.poi.name = e.poi.name
        this.poi.typecode = e.poi.typecode

        // this.map.setZoom(5)
      },
      choosePoi(e) {
        console.log('choosePoi: ', e)
        if (this.placeSearch === null) {
          this.placeSearch = new AMap.PlaceSearch({
            map: this.map,
          }) //构造地点查询类
        }

        this.placeSearch.setCity(e.poi.adcode)
        this.placeSearch.search(e.poi.name) //关键字查询查询
        console.log('PoiList:', this.placeSearch.PoiList)
      },
      clickpoi(marker) {
        console.log('点击了标号,标号ID： %o', marker)
      },
    },
  }
</script>

<style lang="scss">
  .amap-wrap {
    // height: 100vh;
    height: 80vh;
  }
  .el-vue-search-box-container {
    position: absolute;
    left: 45px;
    top: 5px;
    z-index: 10;
    width: 300px;
    height: 30px;
    background: #fff;
    box-shadow: 0 2px 2px rgb(0 0 0 / 15%);
    border-radius: 2px 3px 3px 2px;
  }
</style>
