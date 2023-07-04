<template>
  <div class="color-container">
    <!-- <el-alert title="background-color" type="info">
      {{ colors.img }}
    </el-alert> -->
    <h4>background-color</h4>
    <el-button-group v-if="colors !== null">
      <el-button
        v-for="item in colors.background"
        :key="item.id"
        :style="`background-color: ${
          item.closest_palette_color_html_code
        };width:${item.percent * 5}px`"
        class="background-color"
      ></el-button>
    </el-button-group>

    <h4>foreground-color</h4>
    <el-button-group v-if="colors !== null">
      <el-button
        v-for="item in colors.foreground"
        :key="item.id"
        :style="`background-color: ${
          item.closest_palette_color_html_code
        };width:${item.percent * 5}px`"
        class="foreground-color"
      ></el-button>
    </el-button-group>

    <h4>image-color</h4>
    <el-button-group v-if="colors !== null">
      <el-button
        v-for="item in colors.image"
        :key="item.id"
        :style="`background-color: ${
          item.closest_palette_color_html_code
        };width:${item.percent * 5}px`"
        class="image-color"
      ></el-button>
    </el-button-group>
  </div>
</template>

<script>
  // import $ from 'jquery'
  // import {
  //   getGallery,
  //   getAlbum,
  //   getFaceAlbum,
  //   getFaceGallery,
  //   getMcs,
  //   getImg,
  //   getFace,
  // } from '@/api/gallery'
  export default {
    name: 'Color',
    components: {},
    props: {
      // 带有默认值的对象
      colors: {
        type: Object,
        // 对象或数组默认值必须从一个工厂函数获取
        default: function () {
          return {
            img: 426,
            background: [
              {
                id: 101,
                r: 242,
                g: 198,
                b: 156,
                closest_palette_color_html_code: '#fcd29e',
                closest_palette_color: 'fair beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 4.03573799133301,
                percent: 78.964111328125,
                html_code: '#f2c69c',
                color: 426,
              },
              {
                id: 102,
                r: 110,
                g: 73,
                b: 51,
                closest_palette_color_html_code: '#6e493a',
                closest_palette_color: 'cinnamon',
                closest_palette_color_parent: 'brown',
                closest_palette_distance: 3.06844806671143,
                percent: 20.9036521911621,
                html_code: '#6e4933',
                color: 426,
              },
            ],
            foreground: [
              {
                id: 103,
                r: 231,
                g: 169,
                b: 120,
                closest_palette_color_html_code: '#d4a27c',
                closest_palette_color: 'medium rose-beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 4.19777202606201,
                percent: 59.6222991943359,
                html_code: '#e7a978',
                color: 426,
              },
              {
                id: 104,
                r: 127,
                g: 80,
                b: 53,
                closest_palette_color_html_code: '#7a5747',
                closest_palette_color: 'almond',
                closest_palette_color_parent: 'light brown',
                closest_palette_distance: 5.13545513153076,
                percent: 40.1577339172363,
                html_code: '#7f5035',
                color: 426,
              },
            ],
            image: [
              {
                id: 105,
                r: 239,
                g: 181,
                b: 127,
                closest_palette_color_html_code: '#ecb694',
                closest_palette_color: 'fair rose-beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 5.52706098556519,
                percent: 35.521183013916,
                html_code: '#efb57f',
                color: 426,
              },
              {
                id: 106,
                r: 251,
                g: 232,
                b: 207,
                closest_palette_color_html_code: '#fce2c4',
                closest_palette_color: 'light rose-beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 2.80652976036072,
                percent: 23.5606784820557,
                html_code: '#fbe8cf',
                color: 426,
              },
              {
                id: 107,
                r: 192,
                g: 121,
                b: 77,
                closest_palette_color_html_code: '#ac7654',
                closest_palette_color: 'dark rose-beige',
                closest_palette_color_parent: 'skin',
                closest_palette_distance: 4.81060171127319,
                percent: 20.8791217803955,
                html_code: '#c0794d',
                color: 426,
              },
              {
                id: 108,
                r: 102,
                g: 68,
                b: 48,
                closest_palette_color_html_code: '#6e493a',
                closest_palette_color: 'cinnamon',
                closest_palette_color_parent: 'brown',
                closest_palette_distance: 3.43346619606018,
                percent: 19.7065620422363,
                html_code: '#664430',
                color: 426,
              },
            ],
            color_variance: 30,
            object_percentage: 36.7733726501465,
            color_percent_threshold: 1.75,
          }
        },
      },
      mcstype: {
        type: String,
        default: 'img', // model field name
        required: false,
      },
      title: {
        type: String,
        default: '', // model field name
        required: false,
      },
      id: {
        type: Number,
        default: 269,
        required: false,
      },
    },
    data() {
      return {}
    },
    computed: {
      setColor() {
        console.log('setting the color now')
        return {
          'background-color':
            this.colors.background[1].closest_palette_color_html_code,
        }
      },
    },
    watch: {
      id(newVal, oldVal) {
        this.$nextTick(() => {
          console.log('id have been changed')
        })
      },
    },
    created() {
      // this.fetchAlbum()
      // this.srcList = []
    },
    mounted() {
      // this.setStyles()
    },
    methods: {
      // setStyles() {
      //   this.$nextTick(() => {
      //     this.$refs.tableStyle.$el.style.setProperty(
      //       '--tableBorder',
      //       this.table_border
      //     ) // 给变量赋值
      //     this.$refs.tableStyle.$el.style.setProperty(
      //       '--tableHeaderBorder',
      //       this.table_header_border
      //     ) // 给变量赋值
      //   })
      // },
    },
  }
</script>

<style lang="scss">
  .el-table--fit {
    border: var(--tableBorder);
  }
  .el-table__header-wrapper {
    border: var(--tableHeaderBorder);
  }
</style>
