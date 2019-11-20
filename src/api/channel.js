// 导出 频道相关的API函数
import request from '@/utils/request'
import store from '@/store'

/**
 * 获取我的频道（未登录，获取的系统默认给的频道）
 */
const CHANNEL_KEY = 'hm-toutiao-m-84-channel-key'
export const getMyChannels = () => {
  // 该函数的返回值 必须是promise 将来使用await
  // 登录状态 直接用接口返回数据
  // 未登录
  //  本地未存储频道数据(默认  存储本地)
  //  本地已存储频道数据(本地)
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      const data = await request('/app/v1_0/user/channels', 'get')
      resolve(data)
    // 已登录
    } else {
      // 未登录
      const str = window.localStorage.getItem(CHANNEL_KEY) || '[]'
      const localChannels = JSON.parse(str)
      // 本地未存储
      if (!localChannels.length) {
        // 获取数据
        const data = await request('/app/v1_0/user/channels', 'get')
        // 存储数据
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels))
        resolve(data)
      } else {
        resolve({ channels: localChannels })
      }
    }
  })
}
// 全部频道
export const getAllChannels = () => {
  return request('app/v1_0/channels', 'get')
}
