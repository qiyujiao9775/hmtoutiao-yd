// 权限认证 token令牌
// 约定key
const USER_KEY = 'hmtoutiao-yd-user'
// 获取
export const getUser = () => {
  // token有效期两小时
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
// 设置
export const setUser = (user) => {
  // token有效期两小时
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}
// 删除token
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
