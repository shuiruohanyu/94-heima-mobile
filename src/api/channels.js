import store from '@/store'
/***
 *  负责处理频道数据
 *
 * ***/
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key

/***
 * 获取我的频道数据  没有参数 匿名用户也可以获取数据
 *  要将此方法 改造成 本地化的频道
 * ****/
export function getMyChannels () {
  // 我们要对原来的方法 进行改造 但是不想 改造调用的方式
  // 因为python端 编辑用户接口有问题
  return new Promise(function (resolve, reject) {
    //  支持 本地化缓存  要区分当前是登录用户还是游客用户 如何登录还是游客  可以根据当前有没有token 来判断 是否是登录
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    // 去缓存中读取 用户频道数据
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 本地缓存有数据 应该把本地数据释放给 后面的执行结果
      resolve({ channels: JSON.parse(str) }) // 这里的结构 是和 请求体中的结构一致的
    } else {
      // 本地缓存没有数据 本地没有数据 就要去线上拉取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取 请求的结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 这里还需要 resolve 我们的数据
        resolve(result) // 这里表示直接 成功执行了 获取用户频道数据
        // 频道数据 先把这个数据放入缓存
      }) // 得到线上的一个用户频道列表数据  先把这个数据放入缓存
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
}
/****
 * 获取全部频道
 *
 * **/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/****
 *  删除频道API
 * @params  id 作为删除频道的依据
 * ****/
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有id 就可以直接从缓存中删除对应id的数据
    // 删除频道时 无论如何都有数据的
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 直接将本地缓存中的字符串转化成对象
    // 第一种
    // // 直接用filter删除  直接返回一个新数组 返回不等于id的内容
    // channels = channels.filter(item => item.id !== id) // 得到一个新数组
    // // 应该重新写入缓存
    // localStorage.setItem(key, JSON.stringify(channels))
    // // console.log(channels)
    // 第二种
    const index = channels.findIndex(item => item.id === id) // 找到对应频道的索引
    if (index > -1) {
      // 因为索引下标从0开始
      channels.splice(index, 1) // 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      // 如果执行成功了 我们应该 resolve()
      resolve() // resolve 可以传参 也可以不传参
    } else {
      // 如果没有找到对应的下标
      reject(new Error('没有找到对应的频道..'))
    }
  })
}
