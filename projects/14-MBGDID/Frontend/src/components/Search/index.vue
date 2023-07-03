<template>
  <div class="search-container">
    <!-- face numbers filter -->
    <!-- <el-input-number
      v-model="imgQuery.fc_nums"
      :min="-1"
      :max="6"
      label="faceNums"
      @change="handleFaceNumsChange"
    ></el-input-number> -->
    <!-- prefix-icon="el-icon-search" -->
    <el-input
      v-model="imgQuery.search"
      clearable
      placeholder="Please input what you want"
      @change="handelSearchChange"
    >
      <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
      <i
        slot="prefix"
        class="el-input__icon el-icon-search"
        @click="advancedSearch"
      ></i>
      <el-button
        slot="append"
        icon="el-icon-delete"
        @click="reset_search"
      ></el-button>
    </el-input>
    <div v-if="advanced" class="advancedSearch">
      <!-- face numbers filter -->
      <el-select
        v-model="imgQuery.fc_nums"
        clearable
        filterable
        default-first-option
        placeholder="People Numbers"
        :loading="loading"
        @change="handleFaceNumsChange"
      >
        <el-option
          v-for="item in filterList.fc_nums"
          :key="item"
          :label="item"
          :value="item"
          :disabled="false"
        ></el-option>
      </el-select>

      <!-- face group filter -->
      <el-select
        v-model="checked_fcGroup"
        clearable
        filterable
        default-first-option
        placeholder="Group Name"
        :loading="loading"
        @change="handleGroupChange"
      >
        <el-option
          v-for="item in filterList.group"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :disabled="false"
        >
          <span style="float: left; color: #8492a6">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.img_nums }}
          </span>
        </el-option>
      </el-select>
      <!-- face name filter -->
      <el-select
        v-model="checked_fcName"
        multiple
        clearable
        filterable
        default-first-option
        placeholder="Friend Name"
        :loading="loading"
        @change="handleFaceAlbumChange"
      >
        <el-option
          v-for="item in filterList.fc_name"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :disabled="false"
        >
          <span style="float: left; color: #8492a6">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.value }}
          </span>
        </el-option>
      </el-select>
      <!-- Tags filter -->
      <el-select
        v-model="checked_tags"
        multiple
        clearable
        filterable
        placeholder="Tags"
        default-first-option
        :loading="loading"
        @change="handleTagsChange"
      >
        <el-option
          v-for="item in filterList.tags"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :disabled="false"
        >
          <span style="float: left; color: #8492a6">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.value }}
          </span>
        </el-option>
      </el-select>

      <!-- address filter -->
      <el-select
        v-model="imgQuery.address__city"
        clearable
        filterable
        default-first-option
        placeholder="City"
        :loading="loading"
        @change="handleAddressChange"
      >
        <el-option
          v-for="item in filterList.city"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :disabled="false"
        >
          <span style="float: left; color: #8492a6">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.img_nums }}
          </span>
        </el-option>
      </el-select>

      <!-- category filter -->
      <el-select
        v-model="checked_category"
        clearable
        filterable
        default-first-option
        placeholder="Auto Category"
        :loading="loading"
        @change="handleCategoryChange"
      >
        <el-option
          v-for="item in filterList.category"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :disabled="false"
        >
          <span style="float: left; color: #8492a6">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ item.img_nums }}
          </span>
        </el-option>
      </el-select>

      <!-- Layout filter -->
      <el-select
        v-model="imgQuery.layout"
        clearable
        filterable
        default-first-option
        placeholder="Layout"
        :loading="loading"
        @change="handleLayoutChange"
      >
        <el-option
          v-for="item in filterList.layout"
          :key="item"
          :label="item"
          :value="item"
          :disabled="false"
        ></el-option>
      </el-select>

      <!-- image color filter -->
      <el-select
        v-model="checked_cImg"
        multiple
        clearable
        filterable
        default-first-option
        placeholder="Image Colors"
        :loading="loading"
        @change="handleImgColorChange(checked_cImg, 'img_color')"
      >
        <el-option
          v-for="item in filterList.c_img"
          :key="item.value"
          :label="item.name"
          :value="item.name"
          :disabled="false"
          :style="`background-color: ${item.value}`"
        >
          <span style="float: left; color: #ffffff">{{ item.name }}</span>
          <span style="float: right; color: #ffffff; font-size: 13px">
            {{ item.value }}
          </span>
        </el-option>
      </el-select>
      <!-- background color filter -->
      <el-select
        v-model="checked_cBack"
        multiple
        clearable
        filterable
        default-first-option
        placeholder="Background Colors"
        :loading="loading"
        @change="handleImgColorChange(checked_cBack, 'back_color')"
      >
        <el-option
          v-for="item in filterList.c_back"
          :key="item.value"
          :label="item.name"
          :value="item.name"
          :disabled="false"
          :style="`background-color: ${item.value}`"
        >
          <span style="float: left; color: #ffffff">{{ item.name }}</span>
          <span style="float: right; color: #ffffff; font-size: 13px">
            {{ item.value }}
          </span>
        </el-option>
      </el-select>
      <!-- foreground color filter -->
      <el-select
        v-model="checked_cFore"
        multiple
        clearable
        filterable
        default-first-option
        placeholder="Foreground Colors"
        :loading="loading"
        @change="handleImgColorChange(checked_cFore, 'fore_color')"
      >
        <el-option
          v-for="item in filterList.c_fore"
          :key="item.value"
          :label="item.name"
          :value="item.name"
          :disabled="false"
          :style="`background-color: ${item.value}`"
        >
          <span style="float: left; color: #ffffff">{{ item.name }}</span>
          <span style="float: right; color: #ffffff; font-size: 13px">
            {{ item.value }}
          </span>
        </el-option>
      </el-select>

      <!-- rating -->
      <el-select
        v-model="imgQuery.evaluates__rating"
        clearable
        filterable
        default-first-option
        placeholder="Rating"
        :loading="loading"
        @change="handleRatingChange"
      >
        <el-option
          v-for="item in [1, 2, 3, 4, 5]"
          :key="item"
          :label="item"
          :value="item"
          :disabled="false"
        >
          <el-rate
            :value="item"
            disabled
            show-score
            text-color="#ff9900"
            :colors="ratingColors"
          ></el-rate>
        </el-option>
      </el-select>

      <!-- ordering -->
      <el-select
        v-model="imgQuery.ordering"
        clearable
        filterable
        default-first-option
        placeholder="Ording"
        :loading="loading"
        @change="handleOrdingChange"
      >
        <el-option
          v-for="item in filterList.ordering"
          :key="item"
          :label="item"
          :value="item"
          :disabled="false"
        ></el-option>
      </el-select>
      <!-- date -->
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12">
          <!-- date filter -->
          <!-- <div class="block">
          <span class="demonstration">Date Range</span> -->
          <el-date-picker
            v-model="checked_dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="To"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleDateRangeChange"
          ></el-date-picker>
          <!-- </div> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { getCategory, getFaceAlbum, getFilterList } from '@/api/gallery'
  getCategory
  export default {
    name: 'ImgSearch',
    components: {},
    props: {
      // imgs: {
      //   type: String,
      //   default: '', // model field name
      //   required: false,
      // },
      filteredList: {
        type: Object,
        default: function () {
          return {
            img_color: ['skin', 'black', 'grey', 'blue', 'light grey'],
            fore_color: ['light brown', 'beige', 'light blue'],
            back_color: ['black', 'blue', 'light grey'],
          }
        },
        required: false,
      },
    },
    data() {
      return {
        faceAlbumQuery: {
          page: 1,
          size: 20,
          name: '',
          item_cnt: '',
          c_img: '',
          c_fore: '',
          c_back: '',
        },
        categoryQuery: {
          page: 1,
          size: 20,
          name: '',
          type: '',
          value: '',
          // imgs: '',
          c_img: '',
          c_fore: '',
          c_back: '',
        },
        imgQuery: {
          page: 1,
          size: 20,
          search: '',
          id: '',
          fc_nums: '',
          fc_name: '',
          c_img: '',
          c_fore: '',
          c_back: '',
          address__city: '',
          dates__capture_date__range: '',
          categories__type: '',
          categories__name: '',
          tags: '',
          layout: '',
          evaluates__rating: '',
          search: '',
          ordering: '',
        },
        filterList: {
          fc_nums: [0, 1, 2, 3, 4, 6, 10],
          fc_name: [
            {
              name: 'Avril',
              value: 17,
            },
            {
              name: 'allison',
              value: 7,
            },
            {
              name: 'blue',
              value: 5,
            },
            {
              name: 'Joey',
              value: 4,
            },
            {
              name: 'Rachel',
              value: 4,
            },
            {
              name: 'Ross',
              value: 4,
            },
            {
              name: 'Chandler',
              value: 3,
            },
            {
              name: 'Monica',
              value: 3,
            },
            {
              name: 'Phoebe',
              value: 3,
            },
            {
              name: '奶奶',
              value: 3,
            },
            {
              name: '爷爷',
              value: 3,
            },
            {
              name: 'susan',
              value: 2,
            },
            {
              name: 'unknown_CDfE6',
              value: 2,
            },
            {
              name: '老爸',
              value: 2,
            },
            {
              name: 'girl1',
              value: 1,
            },
            {
              name: 'mothers',
              value: 1,
            },
            {
              name: 'mum',
              value: 1,
            },
            {
              name: 'unknown_cgtk6',
              value: 1,
            },
            {
              name: 'unknown_f9jyo',
              value: 1,
            },
            {
              name: 'unknown_jwZk2',
              value: 1,
            },
            {
              name: 'unknown_n1E6q',
              value: 1,
            },
            {
              name: 'unknown_PXtHh',
              value: 1,
            },
            {
              name: 'unknown_tNySj',
              value: 1,
            },
            {
              name: 'unknown_zDoyW',
              value: 1,
            },
            {
              name: 'woman',
              value: 1,
            },
            {
              name: '老妈',
              value: 1,
            },
          ],
          tags: [
            '210321',
            '210823',
            'abbess',
            'adorable',
            'adult',
            'affection',
            'allison',
            'attractive',
            'baby',
            'bath linen',
            'bath towel',
            'bed',
            'bedroom',
            'black',
            'blanket',
            'blond',
            'blue',
            'boy',
            'breakfast',
            'brother',
            'brunette',
            'buddy',
            'care',
            'cheerful',
            'child',
            'childhood',
            'children',
            'closeup',
            'container',
            'couple',
            'cover girl',
            'cute',
            'dad',
            'daughter',
            'deity',
            'dessert',
            'dinner',
            'doll',
            'eating',
            'elderly',
            'erotic',
            'expression',
            'eyes',
            'face',
            'family',
            'fashion',
            'father',
            'food',
            'friends',
            'friendship',
            'frozen dessert',
            'fun',
            'girls',
            'gorgeous',
            'grandfather',
            'grandma',
            'grandmother',
            'group',
            'hair',
            'hair spray',
            'haircut',
            'hairstyle',
            'happiness',
            'happy',
            'home',
            'hospital',
            'human',
            'husband',
            'ice lolly',
            'import date',
            'infant',
            'innocence',
            'innocent',
            'joy',
            'kid',
            'kids',
            'kin',
            'lady',
            'lifestyle',
            'linen',
            'lingerie',
            'lips',
            'little',
            'lock',
            'long',
            'look',
            'looking',
            'love',
            'lovely',
            'lunch',
            'lying',
            'make',
            'makeup',
            'male',
            'man',
            'married',
            'mature',
            'meal',
            'microphone',
            'model',
            'mother',
            'nurse',
            'nutriment',
            'offspring',
            'old',
            'one',
            'oriental',
            'outdoors',
            'parent',
            'park',
            'people',
            'person',
            'piggy bank',
            'pillow',
            'plate',
            'plaything',
            'portrait',
            'posing',
            'pretty',
            'quilt',
            'restaurant',
            'retired',
            'retirement',
            'saint',
            'savings bank',
            'school',
            'senior',
            'sensual',
            'sensuality',
            'sexy',
            'shoulder',
            'sibling',
            'singer',
            'sitting',
            'skin',
            'smasher',
            'smile',
            'smiling',
            'son',
            'studio',
            'superior',
            'susan',
            'table',
            'toddler',
            'together',
            'togetherness',
            'toiletry',
            'towel',
            'wife',
            'women',
            'youth',
            '奶奶',
            '导入时间',
            '爷爷',
            '老妈',
            '老爸',
          ],
          c_img: [
            {
              name: 'beige',
              value: '#e0c4b2',
            },
            {
              name: 'black',
              value: '#39373b',
            },
            {
              name: 'blue',
              value: '#2f5e97',
            },
            {
              name: 'brown',
              value: '#574039',
            },
            {
              name: 'dark green',
              value: '#176352',
            },
            {
              name: 'green',
              value: '#359369',
            },
            {
              name: 'grey',
              value: '#8c8c8c',
            },
            {
              name: 'lavender',
              value: '#6a6378',
            },
            {
              name: 'light blue',
              value: '#99b1cb',
            },
            {
              name: 'light brown',
              value: '#ac8a64',
            },
            {
              name: 'light grey',
              value: '#bcb8b8',
            },
            {
              name: 'light pink',
              value: '#e6c1be',
            },
            {
              name: 'maroon',
              value: '#6c2135',
            },
            {
              name: 'mauve',
              value: '#ac6075',
            },
            {
              name: 'navy blue',
              value: '#2b2e43',
            },
            {
              name: 'olive green',
              value: '#7f8765',
            },
            {
              name: 'pink',
              value: '#e3768c',
            },
            {
              name: 'purple',
              value: '#875287',
            },
            {
              name: 'red',
              value: '#ae2935',
            },
            {
              name: 'skin',
              value: '#bd9769',
            },
            {
              name: 'teal',
              value: '#426972',
            },
            {
              name: 'violet',
              value: '#473854',
            },
            {
              name: 'white',
              value: '#f4f5f0',
            },
            {
              name: 'yellow',
              value: '#ebd07f',
            },
          ],
          c_back: [
            {
              name: 'beige',
              value: '#e0c4b2',
            },
            {
              name: 'black',
              value: '#39373b',
            },
            {
              name: 'blue',
              value: '#2f5e97',
            },
            {
              name: 'brown',
              value: '#574039',
            },
            {
              name: 'grey',
              value: '#8c8c8c',
            },
            {
              name: 'lavender',
              value: '#6a6378',
            },
            {
              name: 'light blue',
              value: '#99b1cb',
            },
            {
              name: 'light brown',
              value: '#ac8a64',
            },
            {
              name: 'light green',
              value: '#aec98e',
            },
            {
              name: 'light grey',
              value: '#bcb8b8',
            },
            {
              name: 'light pink',
              value: '#e6c1be',
            },
            {
              name: 'maroon',
              value: '#6c2135',
            },
            {
              name: 'mauve',
              value: '#ac6075',
            },
            {
              name: 'navy blue',
              value: '#2b2e43',
            },
            {
              name: 'olive green',
              value: '#7f8765',
            },
            {
              name: 'orange',
              value: '#e2855e',
            },
            {
              name: 'pink',
              value: '#e3768c',
            },
            {
              name: 'skin',
              value: '#bd9769',
            },
            {
              name: 'violet',
              value: '#473854',
            },
            {
              name: 'white',
              value: '#f4f5f0',
            },
            {
              name: 'yellow',
              value: '#ebd07f',
            },
          ],
          c_fore: [
            {
              name: 'beige',
              value: '#e0c4b2',
            },
            {
              name: 'black',
              value: '#39373b',
            },
            {
              name: 'blue',
              value: '#2f5e97',
            },
            {
              name: 'brown',
              value: '#574039',
            },
            {
              name: 'grey',
              value: '#8c8c8c',
            },
            {
              name: 'lavender',
              value: '#6a6378',
            },
            {
              name: 'light blue',
              value: '#99b1cb',
            },
            {
              name: 'light brown',
              value: '#ac8a64',
            },
            {
              name: 'light green',
              value: '#aec98e',
            },
            {
              name: 'light grey',
              value: '#bcb8b8',
            },
            {
              name: 'light pink',
              value: '#e6c1be',
            },
            {
              name: 'maroon',
              value: '#6c2135',
            },
            {
              name: 'mauve',
              value: '#ac6075',
            },
            {
              name: 'navy blue',
              value: '#2b2e43',
            },
            {
              name: 'olive green',
              value: '#7f8765',
            },
            {
              name: 'plum',
              value: '#58304e',
            },
            {
              name: 'red',
              value: '#ae2935',
            },
            {
              name: 'skin',
              value: '#bd9769',
            },
            {
              name: 'white',
              value: '#f4f5f0',
            },
          ],
          category: [
            {
              name: 'events parties',
              value: null,
            },
            {
              name: 'food drinks',
              value: null,
            },
            {
              name: 'interior objects',
              value: null,
            },
            {
              name: 'nature landscape',
              value: null,
            },
            {
              name: 'paintings art',
              value: null,
            },
            {
              name: 'people portraits',
              value: null,
            },
            {
              name: 'pets animals',
              value: null,
            },
            {
              name: 'streetview architecture',
              value: null,
            },
            {
              name: 'text visuals',
              value: null,
            },
          ],
          group: [
            {
              name: 'allison,blue',
              value: null,
            },
            {
              name: 'allison,mothers,mum,susan',
              value: null,
            },
            {
              name: 'allison,老妈,老爸',
              value: null,
            },
            {
              name: 'blue,susan',
              value: null,
            },
            {
              name: 'blue,奶奶,爷爷',
              value: null,
            },
            {
              name: 'blue,奶奶,爷爷,老爸',
              value: null,
            },
            {
              name: 'Chandler,Joey,Monica,Phoebe,Rachel,Ross',
              value: null,
            },
            {
              name: 'Joey,Rachel,Ross',
              value: null,
            },
            {
              name: 'no face',
              value: null,
            },
            {
              name: 'single face',
              value: null,
            },
            {
              name: '奶奶,爷爷',
              value: null,
            },
          ],
          city: [
            {
              name: 'No GPS',
              value: null,
            },
            {
              name: '台州市',
              value: null,
            },
            {
              name: '宁波市',
              value: null,
            },
          ],
          layout: ['Square', 'Wide', 'Tall'],
          size: ['Small', 'Medium', 'Large', 'Extra large', 'At least'],
          license: [
            'Public domain',
            'Free to share and use',
            'Free to share and use commercially',
          ],
        },
        checked_fcName: [],
        checked_cImg: [],
        checked_cFore: [],
        checked_cBack: [],
        checked_dateRange: [],
        checked_tags: [],
        checked_category: '',
        checked_fcGroup: '',
        checked_rating: 0,

        list: [],
        loading: false,
        states: [],
        ratingColors: ['#99A9BF', '#F7BA2A', '#FF9900'],

        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              },
            },
          ],
        },
        advanced: false,
      }
    },
    watch: {
      // filteredList(newVal, oldVal) {
      //   deep: true,
      //     this.$nextTick(() => {
      //       console.log('filtered category have been changed', newVal)
      //       this.opt_cImg = newVal.img_color
      //       this.opt_cFore = newVal.fore_color
      //       this.opt_cBack = newVal.back_color
      //       // this.categoryQuery.imgs = newVal
      //       // this.categoryQuery.imgs = this.imgQuery
      //       // this.fetchCategory()
      //       // this.fetchFaceAlbum()
      //     })
      // },
    },
    created() {},
    mounted() {
      // this.list = this.states.map((item) => {
      //   return { value: `value:${item}`, label: `label:${item}` }
      // })
      this.fetchCategory()
    },
    methods: {
      onSearch() {
        this.imgQuery.page = 1
        // this.fetchCategory()
        this.$emit('handleImgSearch', this.imgQuery) //自定义事件  传递值“子向父组件传值”
      },

      handelSearchChange(value) {
        console.log(value)
        // this.imgQuery.fc_nums = value // already binded
        this.onSearch()
      },
      handleFaceNumsChange(value) {
        // console.log(value)
        // this.imgQuery.fc_nums = value // already binded
        this.onSearch()
      },
      handleFaceAlbumChange(value) {
        this.imgQuery.fc_name = value.toString()
        this.onSearch()
      },
      handleTagsChange(value) {
        this.imgQuery.tags = value.toString()
        this.onSearch()
      },
      handleLayoutChange(value) {
        this.imgQuery.layout = value.toString()
        this.onSearch()
      },
      handleImgColorChange(value, type) {
        // console.log('handleImgColorChange：' + value.toString(), type)
        if (type === 'img_color') this.imgQuery.c_img = value.toString()
        if (type === 'back_color') this.imgQuery.c_back = value.toString()
        if (type === 'fore_color') this.imgQuery.c_fore = value.toString()
        this.onSearch()
      },
      handleAddressChange(value) {
        // console.log('handleAddressChange: ' + value)
        // this.imgQuery.address__city = value // already binded
        this.onSearch()
      },
      handleCategoryChange(value) {
        // console.log('handleCategoryChange: ' + value)
        // this.imgQuery.address__city = value // already binded
        this.imgQuery.categories__name = value
        this.onSearch()
      },
      handleGroupChange(value) {
        // console.log('handleCategoryChange: ' + value)
        // this.imgQuery.address__city = value // already binded
        this.imgQuery.categories__name = value
        this.onSearch()
      },
      handleRatingChange(value) {
        // console.log('handleCategoryChange: ' + value)
        this.imgQuery.evaluates__rating = value
        this.onSearch()
      },

      handleDateRangeChange(value) {
        // console.log('handleDateRangeChange: ' + value)
        this.imgQuery.dates__capture_date__range = value.toString()
        this.onSearch()
      },
      handleOrdingChange(value) {
        // console.log('handleDateRangeChange: ' + value)
        this.imgQuery.ordering = value.toString()
        this.onSearch()
      },

      // remoteMethod(query) {
      //   if (query !== '') {
      //     this.loading = true
      //     setTimeout(() => {
      //       this.loading = false
      //       this.opt_cImg = this.list.filter((item) => {
      //         return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
      //       })
      //     }, 200)
      //   } else {
      //     this.opt_cImg = []
      //   }
      // },
      async fetchCategory() {
        console.log('start to get the Category list...')
        const { data } = await getFilterList(this.categoryQuery)
        this.filterList = data
      },

      reset_search() {
        console.log(this.$data)
        console.log(this.$options.data())
        Object.assign(this.$data, this.$options.data())
        this.fetchCategory()
        this.onSearch()
      },
      advancedSearch() {
        console.log('advancedSearch')
        this.advanced = !this.advanced
      },
    },
  }
</script>

<style lang="css" scoped></style>
