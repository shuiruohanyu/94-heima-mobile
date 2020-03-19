/** **
 *  plugin.js专门负责提供小函数以及vue中常用的过滤器及函数
 *
 * ***/
export default {
  // 导出一个默认对象
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此行代码时 Vue.prototype.$notify 应该已经挂载完成
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 小伎俩
    // 给Vue的原型属性赋值一个函数 自定义一个函数名
    Vue.prototype.$sleep = sleep // 定义一个原型属性 $sleep 所有组件都有了这个属性
  }
}
// 休眠函数
// time  = 500 如果你传入了time 用你的 如果说你没传 time 用 500
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但是有一个延迟
    setTimeout(() => resolve(), time)
  })
}
