import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
//ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import "./design/main.css";
import "./design/app.less";

const app = createApp(App);

app.use(router);
app.use(Antd);
app.mount("#app");
