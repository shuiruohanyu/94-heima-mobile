<template>
  <div class="container">
      <!-- 放置tabs组件 -->
      <van-tabs>
         <!-- 内部需要放置子 标签  title值为当前显示的内容-->
         <!-- van-tab是vant组件的样式  -->
         <!-- 拿到channels数据之后吧 应该做什么 -->
         <van-tab :title="item.name" v-for="item in channels" :key="item.id">
            <!-- 生成若干个单元格 -->
            <!-- 这里为什么叫scroll-wrapper  因为样式中对它进行了设置 -->
            <!-- <div class='scroll-wrapper'>
              <van-cell-group>
                <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
              </van-cell-group>
            </div> -->
            <!-- 有多少个tab 就有多少个 article-list  相当于多个article-list实例-->
            <!-- 需要将频道id传递给每一个列表组件  父 => 子 props -->
            <!-- 监听article-list触发的showAction事件 -->
             <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 放置一个弹层组件 -->
      <van-popup v-model="showMoreAction" style="width: 80%">
        <!-- 放置反馈的组件 -->
        <MoreAction />
      </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction
  },
  // 组件中为什么data是 返回一个新对象
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false // 是否显示弹层 默认不显示组件
    }
  },
  methods: {
    async  getMyChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 此方法 会在article-list组件触发 showAction的时候 触发
    openAction () {
      // 此时应该弹出反馈的层
      this.showMoreAction = true
    }
  },
  created () {
    // 直接获取频道数据
    this.getMyChannels()
  }
}
</script>
<style lang='less' scoped>
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
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
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
</style>
