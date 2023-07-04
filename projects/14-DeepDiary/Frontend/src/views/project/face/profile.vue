<template>
  <div class="profile-container">
    <!-- <el-alert title="profile组件消息提示的文案" type="info"></el-alert> -->

    <div id="profile" ref="profile">
      <el-descriptions
        class="margin-top"
        :title="title"
        extra="Extra"
        :column="3"
        size="small"
        border
      >
        <template slot="extra">
          <el-button type="primary" size="small">Sync</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            id
          </template>
          {{ id }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            Relationship to User
          </template>
          {{ profile.relation }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            Tel
          </template>
          {{ profile.tel }}
        </el-descriptions-item>

        <!-- supplys start here -->
        <!-- <el-descriptions-item
          v-for="(item, index) in profile.supplys"
          :key="item.id"
        >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Resource{{ index }} Tags
          </template>
          {{ item.tags }}
        </el-descriptions-item> -->

        <el-descriptions-item
          v-for="(item, index) in profile.supplys"
          :key="item.id"
        >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Resource {{ index }} Desc
          </template>
          {{ item.desc }}
        </el-descriptions-item>

        <!-- demands start here  -->
        <!-- <el-descriptions-item
          v-for="(item, index) in profile.demands"
          :key="item.id"
        >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Demands{{ index }} Tags
          </template>
          {{ item.tags }}
        </el-descriptions-item> -->

        <el-descriptions-item
          v-for="(item, index) in profile.demands"
          :key="item.id"
        >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Demands {{ index }} Desc
          </template>
          {{ item.desc }}
        </el-descriptions-item>

        <!-- others start here  -->
        <!-- <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Key of Resource2
          </template>
          Key of Resource2
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Key of Resource3
          </template>
          Key of Resource3
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Resource1
          </template>
          Detail of Resource1
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Resource2
          </template>
          Detail of Resource2
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Resource3
          </template>
          Detail of Resource3
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Key of Desired1
          </template>
          Key of Desired1
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Key of Desired2
          </template>
          Key of Desired2
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Key of Desired3
          </template>
          Key of Desired3
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Desired1
          </template>
          Detail of Desired1
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Desired2
          </template>
          Detail of Desired2
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            Detail of Desired3
          </template>
          Detail of Desired3
        </el-descriptions-item> -->
      </el-descriptions>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import {
    getGallery,
    getAlbum,
    getFaceAlbum,
    getFaceGallery,
    getprofile,
    getImg,
    getFace,
  } from '@/api/gallery'
  import { getUserProfile } from '@/api/user'
  export default {
    name: 'Profile',
    components: {},
    props: {
      // title: {
      //   type: String,
      //   default: '', // model field name
      //   required: false,
      // },
      id: {
        type: Number,
        default: 269,
        required: true,
      },
    },
    data() {
      return {
        profile: {
          username: 'blue',
          relation: 'myself,owner',
          tel: '15055305685',
          avatar: 'http://localhost:8000/media/sys_img/logo_lg.png',
          introduction: 'deep-diary creater',
          roles: 'admin',
          profile_url: 'http://localhost:8000/api/user/1/',

          supplys: [],

          demands: [],

          facealbum: {
            id: 32,
            album_url: 'http://localhost:8000/api/faces/32/',
            name: 'blue',
            src: 'http://localhost:8000/media/face/face_aQVml.jpg',
          },
        },
        profileQueryForm: {
          id: 0,
        },
        title: 'Sources and Demands',
      }
    },
    computed: {},
    watch: {
      id(newVal, oldVal) {
        this.$nextTick(() => {
          console.log('gallery have been changed')
          this.fetchProfile()
        })
      },
    },
    created() {
      // this.fetchAlbum()
      // this.srcList = []
    },
    mounted() {
      this.fetchProfile()
    },
    methods: {
      async fetchProfile() {
        console.log('start to get the profile..., the profile id is ', this.id)
        this.profileQueryForm.id = this.id
        if (this.id === 0) {
          this.setProfileDefault()
          this.title = 'Sources and Demands: the proofile not exist yet'
          return
        }
        this.title = 'Sources and Demands: ' + this.id
        const { data } = await getUserProfile(this.profileQueryForm, this.id)
        this.profile = data
        //   if (data.supplydemand === null) {
        //     this.setProfileDefault()
        //   } else {
        //     console.log(data)
        //     this.supplydemand = data.supplydemand
        //   }
      },

      setProfileDefault() {
        console.log('null++++-----------')
      },
    },
  }
</script>

<style lang="css" scoped></style>
