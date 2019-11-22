<template>
  <van-action-sheet
    :value="value"
    @closed="editing=false"
    @input="$emit('input', $event)"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in myChannels" :key="item.id">
          <span @click="enterChannel(i)" class="f12" :class="{red:activeIndex===i}">{{item.name}}</span>
          <van-icon
            @click="delChannel(i,item.id)"
            v-show="editing && i!==0"
            class="btn"
            name="cross"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 父组件数据  我的频道
    myChannels: {
      type: Array,
      // 复杂数据类型  函数返回
      default: () => [] // fang法
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 控制编辑和完成按钮
      editing: false,
      // 全部频道
      allChannels: []
    }
  },
  computed: {
    optionalChannels () {
      // 可选频道 = 全部频道 - 我的频道
      // 在遍历全部频道的时候，去我的频道中找
      // 如果找到，不是可选频道，不该出现在新数组中
      // 如果没找到，是可选频道，出现在新数组中
      // this.allChannels.filter(item => '布尔类型')
      return this.allChannels.filter(
        item =>
          this.myChannels.findIndex(myItem => myItem.id === item.id) === -1
      )
    }
  },
  created () {
    // 获取全部频道
    this.getAllChannels()
  },
  methods: {
    // 添加频道

    async addChannel ({ id, name }) {
      try {
        // 包装传参（目的是支撑接口调用， 支持本地存储）
        // 接口需要[{id,seq}]  排除推荐
        // 本地需要  id name
        // 最终数据：[{id ,name ,seq}]
        // 得到排序频道数组
        const orderChannels = this.myChannels.map((item, i) => {
          return {
            id: item.id,
            name: item.name,
            seq: i
          }
        })
        orderChannels.push({ id, name, seq: orderChannels.length })
        // 后端不用推荐
        orderChannels.splice(0, 1)
        await addChannel(orderChannels)
        console.log(orderChannels)
        // 提示
        this.$toast.success('添加成功')
        // 在我的频道中添加一个新的频道
        this.myChannels.push({
          id,
          name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          // 记录阅读位置
          scrollTop: 0
        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },

    // 删除频道
    async delChannel (index, channelId) {
      try {
        // 调用删除API 删除
        await delChannel(channelId)
        // 提示
        this.$toast.success('删除成功')
        // （删除频道索引小于或等于当前激活频道索引）当前激活频道前移一位
        if (index <= this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
          // this.activeIndex = this.activeIndex - 1
        }
        // 删除mychannels数据中index对应频道
        // 只读  只允许 父传子而不能子传父 使用props接收 单项数据流
        // 当传入数据是简单数据类型（当修改props数据  不改变其能引用这个条件） 成立 是可以修改数据
        // 总结：：：传入数据或对象  可以改值 不能重新赋值  否则影响父组件
        this.myChannels.splice(index, 1)
        // 通知父组件调用的changeChannel函数
        // 子传父
        this.$emit('on-delete')
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    },
    // 进入频道
    enterChannel (index) {
      // 修改activeIndex的值index即可
      this.$emit('input', false)
      // 关闭频道
      this.$emit('update:activeIndex', index)
    },

    // 全部频道啥
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
