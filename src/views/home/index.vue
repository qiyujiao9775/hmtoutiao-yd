<template>
  <div class="container">
    <!-- swipeable开启手势切换功能 -->
    <van-tabs swipeable v-model="activeIndex">
      <van-tab :key="channel.id" v-for="channel in myChannels" :title="channel.name">
        <!-- 滚动容器 -->
        <div class="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list v-model="activeChannel.upLoading" :finished="activeChannel.finished" finished-text="没有更多了" @load="onLoad">
              <van-cell v-for="item in activeChannel.articles" :key="item.art_id.toString()">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type===3">
                    <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="item.cover.type===1">
                    <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate}}</span>
                    <span class="close">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 频道按钮 -->
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/article'

export default {
  name: 'home-index',
  data () {
    return {
      // ----列表需要的数据----
      // 上拉加载中(正在加载)
      // upLoading: false,
      // 是否全部加载完成
      // finished: false,
      // 文章列表
      // articles: [],
      // 下拉 是不是正在刷新中
      // downLoading: false,
      // 刷新完毕后提示文字（暂无更新|更新成功）
      refreshSuccessText: '',
      myChannels: [],
      // 当前激活的频道索引
      activeIndex: 0
    }
  },
  computed: {
    // 当前激活的频道
    activeChannel () {
      return this.myChannels[this.activeIndex]
    }
  },
  created () {
    // 获取频道数据
    this.getMyChannels()
    // 获取文章列表 组件初始化默认激活频道一定是推荐
    // this.getArticles()
  },
  methods: {

    async getMyChannels () {
      const data = await getMyChannels()
      // this.myChannels = data.channels
      this.myChannels = data.channels.map(item => {
        return {
          id: item.id,
          name: item.name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now()
        }
      })
    },
    async onLoad () {
      //   @load特点：默认在组件初始化会加载一次。
      //   @load特点：当加载的内容渲染后不足一屏，继续触发一次。
      //   @load事件触发条件：往上滑动到底部触发。
      //   业务：获取列表数据进行渲染  现在是模拟
      // 模拟加载数据

      // window.setTimeout(() => {
      //   // 数据加载成功 结束加载效果
      //   this.upLoading = false
      //   // 模拟数据
      //   const data = []
      //   // 每加载一次  往后生成十条数据
      //   for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //     data.push(i + 1)
      //   }
      //   // 追加
      //   this.articles.push(...data)
      //   // 判断数据是否全部加载完
      //   if (this.articles.length >= 50) {
      //     this.finished = true
      //   }
      //   // console.log('ok')
      // }, 1000)

      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      this.activeChannel.upLoading = false
      this.activeChannel.articles.push(...data.results)
      if (!data.pre_timestamp) {
        this.activeChannel.finished = true
      } else {
        this.activeChannel.timestamp = data.pre_timestamp
      }
    },
    // 下拉
    async onRefresh () {
      // @refresh  在下拉的时候松手触发
      // window.setTimeout(() => {
      //   // 1. 结束正在刷新的效果
      //   this.downLoading = false
      //   // 2. 模拟数据
      //   const data = [1, 2, 3, 4]
      //   // const data = [ ]

      //   if (data.length) {
      //     // 3,更新数据
      //     this.articles = data
      //     //  刷新后的提示
      //     this.refreshSuccessText = '更新成功'
      //     // 不满足一屏  主动加载一次数据
      //     this.onLoad()
      //     // 重置加载全部数据是否完毕状态
      //     this.finished = false
      //   } else {
      //     // 3.给刷新提示
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)
      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(this.activeChannel.id, this.activeChannel.timestamp)
      this.activeChannel.downLoading = false
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.refreshSuccessText = '更新成功'
        this.activeChannel.finished = false
        // 更新当前频道下获取数据的时间戳
        this.activeChannel.timestamp = data.pre_timestamp
        this.onLoad()
      } else {
        this.refreshSuccessText = '暂无更新'
      }
    }

  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 文章列表的样式
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
