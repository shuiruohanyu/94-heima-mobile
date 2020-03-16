/******
 *  store 下的index.js 专门处理 vuex中的模块
 *
 * *****/
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 专门来放置需要共享的状态
    // { token: '', refresh_token: ''  }  现在还没有设置  预设
    user: auth.getUser() // 就是我们的token信息的对象 如果你要做持久化 如果缓存有token 读取缓存的token
  },
  // 要改token 只能通过 mutations
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的user数据给state
      // 更新vuex的时候 也应该 将最新的数据 存入本地缓存
      auth.setUser(payload.user) // 相当于 保持 vuex和 本地存储的同步
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      // 缓存数据也需要更新
      auth.delUser() // 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
