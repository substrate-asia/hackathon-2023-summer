<template>
    <div style="border: 1px solid #373a40">
      <Toolbar
        style="border-bottom: 1px solid #373a40"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      @onChange="handleChange"
      />
    </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, toRefs, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const emits = defineEmits(['update:value']);

const props = defineProps({
  value: String,
  placeholder: String,
});
const { value: valueHtml, placeholder } = toRefs(props);
const emptyValue = ref('<p><br></p>');

type InsertFnType = (url: string, alt: string, href: string) => void;

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
// const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
    // setTimeout(() => {
    //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
    // }, 1500)
})

const mode = 'default' ;
const toolbarConfig = {}
const editorConfig = <any>{ placeholder: placeholder?.value, MENU_CONF: {} }
editorConfig.MENU_CONF['uploadImage'] = {
  // 自定义上传
  async customUpload(file: File, insertFn: InsertFnType) {
    // TS 语法
    // file 即选中的文件
    // 自己实现上传，并得到图片 url alt href
    // 最后插入图片
    // insertFn(url, alt, href)
    try {
      console.log("file：",file)
      // const { data } = await uploadImage({ file });
      // 最后插入图片
      insertFn('data.data', '', 'data.data');
    } catch (error: any) {
      console.log('error:', error);
    }
  },
};

// 插入链接
editorConfig.MENU_CONF['insertLink'] = {
  parseLinkUrl: customParseLinkUrl,
};
// 更新链接
editorConfig.MENU_CONF['editLink'] = {
  parseLinkUrl: customParseLinkUrl,
};

// 自定义转换链接 url
async function customParseLinkUrl(url: string) {
  if (url.indexOf('http') !== 0 || url.indexOf('https') !== 0) {
    return `http://${url}`;
  }
  return url;
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  editor.setHtml(valueHtml?.value); //文本框赋值
};

const handleChange = (editor: any) => {
  if (editor.isEmpty()) {
    emits('update:value', '');
  } else {
    emits('update:value', editor.getHtml());
  }
};

watch(props, (valueHtml) => {
  if (valueHtml?.value === '') {
    editorRef.value.setHtml(emptyValue.value); //文本框赋值
  }
});
</script>
<style>
.w-e-bar, .w-e-text-container{
  background-color: #25262b;
  color: #fff;
}
.w-e-bar-divider{
  background-color: #373a40;
}
</style>