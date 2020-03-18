/****
 * 需要导出一个对象
 * ***/
module.exports = {
//   需要更改less中变量的配置
  css: {
    //   css相关
    loaderOptions: {
      // 所有的关于样式loader相关的选项
      less: {
        // 这里的选项写什么?
        // modifyVars 是less-loader的一个选项 通过这个选项可以改变 变量的值
        modifyVars: {
          // 直接覆盖变量  变量名不需要@
          blue: '#3296fa'

          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
        }
      }
    }
  }
}
