<template>
  <div class="imgs-item">
    <el-image
      style="width: 200px; height: 200px"
      :src="img.thumb"
      :preview-src-list="[img.src]"
      fit="cover"
    ></el-image>
  </div>
</template>
<script>
  export default {
    name: 'ImgItem',
    props: {
      // 单向数据流，也是静态属性
      img: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {}
    },
    watch: {},
    methods: {},
  }
</script>
<style lang="scss">
  .imgs-item {
    height: 220px;
    margin: auto;
    padding: 10px 10px 0;
    // background-color: #fff;
    border-radius: 24px;
  }
</style>
