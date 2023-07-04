
<template>
  <div class="">
    <!-- Default Layout -->
    <a-layout class="layout-default" id="layout-default" :class="layoutClass">
      <!-- Layout Header's Conditionally Fixed Wrapper -->
      <Header msg="Vite + Vue" />
      <!-- / Layout Header's Conditionally Fixed Wrapper -->

      <!-- Layout Content -->
      <a-layout class="layout-default-page pt-[64px] !bg-[#000000]">
        <!-- Page Content -->
        <a-layout-content class="layout-default-content px-[50px]">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />
        </a-layout-content>
        <!-- / Page Content -->
        <Fotter />
      </a-layout>
      <!-- / Layout Content -->
    </a-layout>
    <!-- / Dashboard Layout -->
  </div>
</template>
<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import Header from './components/Header.vue'
import Fotter from './components/Fotter.vue'
import { computed } from "vue";
import { ConfigProvider } from 'ant-design-vue';

ConfigProvider.config({
  theme: {
    primaryColor: '#E2B578',
  },
});
const routes = useRoute();

const layoutClass = computed(() => {
  return routes.meta.layoutClass;
});
</script>

<style scoped>

.ant-layout {
  background: #000000;
  color: #FFFFFF;
}

.layout-default-page {
  min-height: 100vh;
}

.layout-default-content {
  width: 100%;
  max-width: 1920px;
  min-width: 1080px;
  margin: 24px auto;
  border-radius: 12px;
  border: 1px solid transparent;
}
.border-b{
  border-bottom: 1px solid #FFFFFF;
}
.border-t{
  border-top: 1px solid #FFFFFF;
}
</style>
