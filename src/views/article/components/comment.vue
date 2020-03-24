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
            <van-tag plain @click="showReply=true">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>

    </van-list>
    <!-- 底部输入框 用来输入评论的 -->
    <div class="reply-container van-hairline--top">
        <!-- 绑定了评论内容 -->
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
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
      offset: null // 偏移量 分页依据 第一页数据 null 第二页数据 offset  第一页最后一个id ...
    }
  },
  methods: {
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
