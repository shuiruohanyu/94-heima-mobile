<template>
  <div class="comment">
      <!-- 列表组件 上拉加载 评论是不能一口气加载完的 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 评论列表 -->
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <!-- 用户头像 -->
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <!-- 用户名称 -->
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <!-- 时间  过滤器 过滤 -->
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 点击回复标签 弹出面板 而且要处理很多业务 -->
            <van-tag plain @click="openReply(comment.com_id.toString())">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>

    </van-list>
    <!-- 底部输入框 用来输入评论的 -->
    <div class="reply-container van-hairline--top">
        <!-- 绑定了评论内容   不论是 对文章评论还是对评论评论 都是用的一个输入框-->
      <van-field v-model="value" placeholder="写评论...">
        <!-- 要么显示 loading  -->
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 要么显示 提交 如果你点击了提交 首先先把 提交按钮隐藏  这样做的目的是 防止你重复提交 -->
        <!-- 由于点击过快 会连续两次事件 接口是异步的 会造成两次评论 -->
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论 弹出面板   关闭面板时 评论id设置为空-->
      <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
      <!-- 列表组件  关闭第一次自动执行load事件-->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{  item.aut_name }}</span></p>
            <p>{{ item.content }}</p>
            <p><span class="time">{{ item.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
// import { getComments } from '@/api/articles'
import * as articles from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的评论内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 神评论数据
      offset: null, // 偏移量 分页依据 第一页数据 null 第二页数据 offset  第一页最后一个id ...
      showReply: false, // 控制评论的评论面板是否显示
      reply: {
        // 此对象专门放置 面板加载信息
        loading: false, // 评论的评论的加载状态
        finished: false, // 评论的评论是否加载完毕
        offset: null, // 偏移量 作为评论的评论分页加载的时候 查询的依据
        list: [], // 存放 评论的评论的数据
        commentId: null // 用来存放评论Id  用这个id来去查询 这个评论的评论
      }
    }
  },
  methods: {
    // 提交评论
    async  submit () {
    //  点击的时候要做什么 ?
    //  因为此时并没有判断用户是否登录了 先判断用户是否登录 如果没有登录 不让评论 如果登录了才可以继续
      // token
      if (this.$store.state.user.token) {
        //  此时才认为你登录了
        // 首先应该判断是否输入了 评论内容
        // 如果没有评论内容 直接返回
        if (!this.value) return false // 如果没内容 直接返回
        // 如果有内容
        this.submiting = true // 先把提交状态打开 表示在提交中 避免重复提交 只有当 提交完毕之后 才关掉状态
        // 休眠函数 来控制 执行的速度
        await this.$sleep(800) // 强制休眠800毫秒
        try {
          // 提交评论核心内容
          const data = await articles.commentOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是文章id  要么是评论id  需要根据你当前是对谁进行评论
            // 参数
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 如果是对评论进行评论 需要传该评论属于哪个文章 如果是对文章进行评论 不要传这个参数
          }) // 直接提交方法
          // 希望调用完成之后 , 添加的评论数据 直接添加到我们的评论列表
          // data.new_obj 此obj数据是添加成功的一条数据 这一条数据 我们需要 加入到列表中
          // 两种场景  文章评论  评论评论
          if (this.reply.commentId) {
            // 如果此id存在 表示对 评论进行评论
            // 将数据添加到 评论的评论
            this.reply.list.unshift(data.new_obj)
            // 如果是对评论进行评论  需要找到 对应的评论id 将评论id的回复数+1
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId)
            // 寻找文章评论中 等于 当前评论id的id
            comment && comment.reply_count++ // 如果找到就将 回复数量+1
          } else {
            // 表示对文章评论
            this.comments.unshift(data.new_obj) // 一般评论数据加到头部
          }
          this.value = '' // .清空评论内容
        } catch (error) {
          this.$gnotify({ message: '评论失败' })
        }
        this.submiting = false // 状态关闭
      } else {
        try {
          // 认为你没登录
        // 告知用户 如果你想评论 你需要去登录 如果放弃评论 那就放弃
          await this.$dialog.confirm({
            message: '如果想要评论,你需要去登录'
          })
          // 如果点击了确定 需要跳到登录
          // fullPath是完整地址
          // path 是  /articles   /articles?artId=123
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath // 此地址是用户登录成功之后需要回到的页面
            }
          }) // 跳到登录页
        } catch (error) {
          console.log('点击了取消')
        }
      }
    },
    // 打开回复面板 只会在点击回复时 弹出
    openReply (commentId) {
      this.showReply = true // 打开
      // 处理
      this.reply.commentId = commentId
      // 在弹出面板的时候 重置数据
      //  弹出窗口之前  把之前的list清空  重置数据
      this.reply.list = [] // 清空之前的数据
      this.reply.offset = null // 因为希望点击弹出回复面板的时候 是新的数据 从第一页开始
      this.reply.finished = false // 将finsish打开
      this.reply.loading = true // 主动打开加载状态 因为此时没有 主动检查

      this.getReply() // 弹出评论的评论的层时 主动的去请求一次数据
    },
    // 此方法 用来获取评论的评论
    // 此方法  会在第一次 时执行 也会在 加载第二页 .. 第三页 .. 时执行
    async  getReply () {
      const data = await articles.getComments({
        type: 'c', // 表示是评论的评论
        source: this.reply.commentId, // 获取谁的评论的评论
        offset: this.reply.offset // 评论的评论的分页依据
      })
      // 需要将数据追加到 reply.list 队尾
      this.reply.list.push(...data.results)
      this.reply.loading = false// 关闭加载状态
      this.reply.finished = data.last_id === data.end_id // 如果它俩相等 表示 game over
      if (!this.reply.finished) {
        // 如果不等 表示还有下一页数据
        this.reply.offset = data.last_id // 将下一页的分页依据设置给当前的数据
      }
    },
    // 加载方法 滚动条距离底部距离超过一定距离的时候就会触发
    async onLoad () {
      // 数据的加载
      const { artId } = this.$route.query // 任何组件的属性中都都有一个$route选项
      const data = await articles.getComments({
        type: 'a', // a(文章的评论)   c(评论的评论)
        source: artId, // 表示你查询的 谁的 评论
        offset: this.offset // 赋值当前的偏移量
      })
      // 要将data数据赋值给 comments
      this.comments.push(...data.results) // 将评论数据追加到评论列表的尾部
      // 首先 应该关闭 加载状态
      this.loading = false // 关闭正在上拉加载的状态
      // 需要判断是否还有下一页数据
      //    data.end_id === data.last_id  => finished =true  // 没有下一页
      this.finished = data.end_id === data.last_id // 如果两个id相等
      if (!this.finished) {
        // 表示 还没没结束
        // data.last_id是 当前页的最后一个id
        this.offset = data.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
