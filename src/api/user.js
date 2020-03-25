/******
 * 专门处理用户相关的请求
 *
 * ****/
import request from '@/utils/request' // 引入请求模块
// request相当于  axios的一个实例 和axios 有同样的方法和属性
/***
 * 登录方法
 * ***/
export function login (data) {
  return request({
    //   配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // 接收传入的data
    // axios 中body参数放置在data中
  })
  // 返回一个promise对象
}
/****
 * 关注用户
 * ***/
export function followUser (data) {
  return request({
    url: '/user/followings', // 关注用户
    method: 'post',
    data
    // body 参数  body data  query params
  })
}

/****
 * 取消关注用户
 * ***/
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}
/***
 * 获取用户自己的个人信息
 * ***/

export function getUserInfo () {
  return request({
    url: '/user'
  })
}
