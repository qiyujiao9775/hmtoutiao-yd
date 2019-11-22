// 导出  文章相关的API函数
import request from '@/utils/request'

/**
 * 获取文章列表
 * @param {Integer} channelId - 频道ID
 * @param {Integer} timestamp - 时间戳
 */
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
export const disLikes = (articleId) => {
  return request('app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}
export const report = (articleId, type) => {
  return request('app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}
export const suggest = (q) => {
  return request('app/v1_0/suggestion', 'get', { q })
}
