import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout') // 按需引入layout
const home = () => import('@/views/home') // 按需引入home 二级路由
const question = () => import('@/views/question') // 按需引入question 二级路由
const video = () => import('@/views/video') // 按需引入video  二级路由
const user = () => import('@/views/user') // 按需引入user 二级路由
// 其他的一级路由
const chat = () => import('@/views/user/chat') // 小智同学
const login = () => import('@/views/login') // 登录模式
const profile = () => import('@/views/user/profile') // 编辑资料
const search = () => import('@/views/search') // 搜索中心
const searchresult = () => import('@/views/search/result') // 搜索结果
const article = () => import('@/views/article') // 文章中心

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout, // 布局组件 一级路由

    children: [{
      path: '', // 如果path什么都不写 默认就是二级路由的默认组件
      component: home,
      // meta中可以放置当前路由的信息 根据此信息来进行相关的判断
      // meta是固定写法 里面是可以自定义的属性
      meta: { isAlive: true } // 是否缓存组件实例 } // 路由元信息
      // 如果一级路由存在默认的二级路由 那么meta属性应该写在二级路由的对象上
    }, {
      path: '/question',
      component: question // 问答组件
    }, {
      path: '/video',
      component: video // 视频组件
    }, {
      path: '/user',
      component: user
    }]
  }, {
    path: '/user/chat', // 一级路由 小智同学
    component: chat
  }, {
    path: '/login',
    component: login // 一级路由 登录
  }, {
    path: '/user/profile',
    component: profile // 一级路由编辑资料
  }, {
    path: '/search',
    component: search // 一级路由 搜索中心
  }, {
    path: '/search/result',
    component: searchresult // 一级路由搜索中心
  }, {
    path: '/article',
    component: article // 一级路由 文章详情
  }

]

const router = new VueRouter({
  routes
})

export default router
