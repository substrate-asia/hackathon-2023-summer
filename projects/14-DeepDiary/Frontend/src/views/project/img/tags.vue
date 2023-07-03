<template>
  <div class="tag-container">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      size="mini"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="button-new-tag" size="mini" @click="showInput">
      +
    </el-button>
  </div>
</template>

<script>
  export default {
    name: 'Tags',
    props: {
      items: {
        type: String,
        default: () => '',
        required: false,
      },
    },
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
      }
    },
    watch: {
      items(newVal, oldVal) {
        // console.log('items have bee changed: %s --> %s', oldVal, newVal)
        // if the tags string changed, the update the dynamicTags, else set it to null
        if (newVal) this.dynamicTags = newVal.split(',')
        else this.dynamicTags = []
      },
      // deep: true, //为true，表示深度监听，这时候就能监测到a值变化
    },
    mounted() {
      // console.log('INFO: get the tags source for parent component:', this.items)
      // if the tags string changed, the update the dynamicTags, else set it to null
      if (this.items) this.dynamicTags = this.items.split(',')
      else this.dynamicTags = []
    },
    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
        console.log('INFO: one of the tag was deleteded')
      },

      showInput() {
        this.inputVisible = true
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
        console.log('INFO: addtional tag is confirmed')
      },
    },
  }
</script>

<style lang="css" scoped>
  .el-tag + .el-tag {
    margin-top: 10px;
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 20px;
    line-height: 18px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
