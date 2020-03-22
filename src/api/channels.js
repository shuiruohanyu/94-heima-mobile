/***
 *  负责处理频道数据
 *
 * ***/
import request from '@/utils/request'

/***
 * 获取我的频道数据  没有参数 匿名用户也可以获取数据
 *
 * ****/
export function getMyChannels () {
  return request({
    url: '/user/channels'
  })
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
