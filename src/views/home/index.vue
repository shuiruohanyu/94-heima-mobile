<template>
  <div class="container">
      <!-- 放置tabs组件  默认绑定激活页签-->
      <van-tabs v-model="activeIndex">
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
            <!-- 监听谁触发的自定义的事件 就在谁的标签上写监听 -->
             <ArticleList  @showAction="openAction" :channel_id="item.id"></ArticleList>
         </van-tab>
      </van-tabs>
      <!-- 在tabs下放置图标  编辑频道的图标 -->
      <span class="bar_btn" @click="showChannelEdit = true">
        <!-- 放入图标 vant图标 -->
         <van-icon name='wap-nav'></van-icon>
      </span>
      <!-- 放置一个弹层组件 -->
      <van-popup v-model="showMoreAction" style="width: 80%">
        <!-- 放置反馈的组件 -->
        <!-- 应该在此位置监听 more-action触发的事件 -->
        <!-- 不喜欢文章 和 举报文章 用一个方法 -->
        <!-- @事件名="方法名"  @事件名="方法名()" @事件名="方法名($event 参数)" @事件名="逻辑" -->
        <!-- $event 是事件参数 在h5标签中 dom元素的事件参数  自定义事件中$event 就是自定义事件传出的第一个参数 -->
        <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)" />
      </van-popup>
      <!-- 频道编辑组件 放在 弹出面板的组件 -->
      <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
          <!-- 放置频道编辑组件 -->
          <ChannelEdit></ChannelEdit>
      </van-action-sheet>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles' // 不感兴趣
import eventbus from '@/utils/eventbus' // 公共事件处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction, ChannelEdit // 组件注册
  },
  // 组件中为什么data是 返回一个新对象
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层 默认不显示组件
      articleId: null, // 用来接收 点击的文章的id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑组件  默认不显示
    }
  },
  methods: {
    async  getMyChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 此方法 会在article-list组件触发 showAction的时候 触发
    openAction (artId) {
      // 此时应该弹出反馈的层
      this.showMoreAction = true
      //  应该把id给存储起来
      this.articleId = artId
    },
    // 对文章不感兴趣
    // operateType 是操作类型 如果是dislike 就是不喜欢 如果是 report 就是 举报
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣的文章接口
      try {
        // 需要根据一个参数来判断 是举报还是不喜欢
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) //  这里的type怎么办 ?????? 通过$event传出来
        // await下方的逻辑 是 resolve(成功)之后 的
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该 触发一个事件 利用事件广播的机制 通知对应的tab 来删除 文章数据
        // 除了 传一个文章之外 你还需要告诉 监听事件的人 现在处于哪个频道 可以传递频道id
        // this.channels[this.activeIndex].id // 当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 监听了这个事件组件 就要根据id来删除数据
        this.showMoreAction = false // 此时关闭弹层
      } catch (error) {
        // 默认是红色
        this.$gnotify({
          message: '操作失败'
        })
      }
    }
    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //   // 调用举报文章接口
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // await下方认为举报成功
    //     // 同样的也要讲举报的文章删除掉
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 此时关闭弹层
    //   } catch (error) {
    //     // 默认是红色
    //     this.$gnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    // 直接获取频道数据
    this.getMyChannels()
  }
}
</script>
<style lang='less' scoped>
// 处理弹出编辑面板的样式
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
