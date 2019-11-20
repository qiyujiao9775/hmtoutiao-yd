import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

const $sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}
// 过滤器的函数  vue.filter('过滤器名称'， 处理函数（value）)
// .from(time) 获取相对时间
const relTime = (time) => {
  return dayjs().locale('zh-cn').from(time)
  // 本地化 语言
  //   return dayjs().locale('zh-cn').from(time)
//   dataStr
}
export default {
  install (Vue) {
    //
    Vue.prototype.$sleep = $sleep
    // 过滤器
    Vue.filter('relTime', relTime)
  }
}
