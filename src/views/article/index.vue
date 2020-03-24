<template>
  <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{ article.title }}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{ article.aut_name }}</p>
          <p class="time">{{ article.pubdate | relTime }}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{ article.is_followed ? '已关注' : '+ 关注'  }}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容 有标签 有属性 有样式 将标签设置到对应的元素中 v-html -->
      </div>
      <div class="zan">
        <!-- 需要genuine当前的态度 决定 谁拥有active -->
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
       <!-- 放置comment组件 到 detail内部 因为有padding-->
      <Comment />
    </div>

    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading" >
      <!-- 加载进度条 -->
      <div class='loading-container'>
         <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './components/comment' // 引入评论组件
export default {
  components: {
    Comment
  },
  data  () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      loading: false // 遮罩层状态
    }
  },
  methods: {
    // 获取文章详情数据
    async  getArticleInfo () {
      this.loading = true // 打开遮罩弹层
      // 获取地址参数
      const { artId } = this.$route.query // 从当前路由信息对象读取 query参数
      this.article = await getArticleInfo(artId) // 得到文章结果
      this.loading = false // 关闭遮罩弹层
    },
    // 关注或者取消关注
    async follow () {
      this.followLoading = true
      try {
      //  调用 关注或者取消关注
      // 关注  => 取消关注
      // 未关注 => 关注
        if (this.article.is_followed) {
        // 取消关注
          await unfollowUser(this.article.aut_id) // 传入作者id
        } else {
        // 关注
          await followUser({ target: this.article.aut_id }) // 传入作者id
        }
        // 如果成功了
        // pc端 是 重新加载
        // 移动端 不会重新加载 只会修改对应的数据状态
        this.article.is_followed = !this.article.is_followed // 将状态改为对立状态
        this.$gnotify({ type: 'success', message: '关注成功' })
      } catch (error) {
        // 失败会进入到catch
        // error.message 是报错信息 就可以知道哪里出问题 这个错误是从哪里抛出来的
        //  现在写的是中间代码   => 编译的  =>  报错指示的是编译之后的代码 => 推导出哪里出问题了

        this.$gnotify({ message: '操作失败' })
      } finally {
        //  不论你写的执行 是成功的还是失败的  不论是走 try  catch 最终都会进入 finally
        this.followLoading = false // 关闭加载状态
      }
    }
  },
  created () {
    // 钩子函数
    this.getArticleInfo()
  }
}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
