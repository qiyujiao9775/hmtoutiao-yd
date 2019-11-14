// 提供一个配置好的axios请求的函数（调用接口）
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
// 创建一个新的axios实例 ：
const instance = axios.create({
  // 基准值
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 转换相应数据格式
  transformResponse: [(data) => {
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 请求拦截器  追加token到请求头
instance.interceptors.request.use(config => {
// 拦截成功
// 获取token（vuex中state中user中的token）
// 追加token
  if (store.state.user.token) {
    config.headers.Authorizaton = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

// 响应拦截器  1. 获取有效数据  2. token的延长有效期 TODO
instance.interceptors.response.use(res => {
  // 原始的res是什么格式返回什么格式
  // 剥离无效数据 有效数据 res.data.data
  // 注意：有时候并不叫data  有些时候连响应主体都没有
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, err => {
  return Promise.reject(err)
})
export default (url, method, data) => {
  // pararm 选项是get传参
  // data选项是其他请求方式的传参
  instance({
    url,
    method,
    // js表达式运行的结果必须是字符串（params|data）
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data

  })
}
