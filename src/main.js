import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模式
import store from './store'
import Vant from 'vant' // 引入vant组件库
import 'vant/lib/index.css' // 引入vant组件的样式
import '@/styles/index.less' // 引入自定义的全局样式  覆盖vant的样式
import 'amfe-flexible'
Vue.use(Vant) // 注册Vant的所有组件 一旦注册任意位置都可以使用vant的组件 相当于调用了vant的install方法吧
// 以上做法是完整导入的模式
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
