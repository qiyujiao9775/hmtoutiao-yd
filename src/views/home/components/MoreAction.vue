<template>
  <!-- //弹出框 默认隐藏 -->
  <van-popup :value="value" @input="$emit('input',$event)">
    <van-cell-group v-if="!isReport">
      <van-cell icon="closed-eye" @click="disLikes">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="report(item.value)" icon="info-o" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLikes, report } from '@/api/article'
import { reports } from '@/api/constants'
export default {
  name: 'more-action',
  props: {
    // 控制对话框
    articleId: {
      type: String,
      default: null
    },
    // 接收父组件传值
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 默认 状态  未点击举报
      isReport: false,
      reports,
      show: false
    }
  },
  methods: {
    // 举报
    async report (type) {
      try {
        await report(this.articleId, type)
        // 提示
        this.$toast.success('举报成功')
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-report')
      } catch (e) {
        if (e.response.status === 409) {
          this.$toast({ message: '已举报过' })
          return
        }
        this.$toast.fail('举报失败')
      }
    },
    // 不感兴趣
    async disLikes () {
      try {
        // 需要当前文章的ID，父传子（把父组件点击的文章ID传入）
        await disLikes(this.articleId)
        // 成功
        // 1. 隐藏对话框
        this.$emit('input', false)
        // 2. 删除（当前频道下的文章列表）对应的文章
        // 2.1 通知父组件删除对应artcileId的文章
        this.$emit('on-dislikes')
        // 3. 提示
        this.$toast.success('不感兴趣成功')
      } catch (e) {
        this.$toast.fail('不感兴趣失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
