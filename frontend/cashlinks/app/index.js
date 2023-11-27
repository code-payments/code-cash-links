import './style.css'
import { createApp } from 'vue'

import App from './App.vue'
import CodeApp from '../src/index'
import { routes } from '../src/routes/cashlinks'

import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

const opt = {
  bugSnagKey: process.env.BUGSNAG_KEY,
  wsPath: process.env.WS_PATH,
  httpPath: process.env.HTTP_PATH,
  routes,
}

if (opt.bugSnagKey) {
  Bugsnag.start({
    apiKey: process.env.BUGSNAG_KEY,
    plugins: [new BugsnagPluginVue()]
  });
}

const app = createApp(App);
app.use(Bugsnag.getPlugin('vue'))
app.use(CodeApp, opt);
app.mount("#app");