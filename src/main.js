import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from "axios"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import * as voicePromptFun from './constant/voicePrompt'
Vue.prototype.voicePrompt = voicePromptFun.voicePrompt;   //语音提醒

Vue.config.productionTip = false;
Vue.prototype.$axios=Axios;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
