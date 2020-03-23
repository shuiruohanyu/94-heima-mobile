<template>
  <div class="container">
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <!-- 将 导航栏固定在顶部 -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 放置搜索结果列表 实现上拉加载  -->
    <van-list v-model="upLoading" @load="onLoad" :finished="finished">
      <van-cell-group>
        <!-- 文章列表结构 -->
        <van-cell v-for="item in articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ item.title  }}</h3>
            <div class="img_box" v-if="item.cover.type === 3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type === 1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <!-- 用过滤器来处理相对时间 -->
              <span>{{ item.pubdate | relTime }}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import * as Articles from '@/api/articles'
// import { searchArticle } from '@/api/articles'
export default {
  data () {
    return {
      upLoading: false, // 上拉加载状态
      finished: false, // 表示当前的加载是否全部完成了 如果全部完成 应该将finished设置成true
      articles: [], // 放置搜索结果文章的
      page: {
        page: 1, // 当前第几页
        per_page: 10 // 每页的多少条
      }
    }
  },
  methods: {
    // 该方法会在滚动条滚动到底部的时候执行
    async  onLoad () {
      // 加载数据
      const { q } = this.$route.query // 获取query参数
      const data = await Articles.searchArticle({ ...this.page, q })
      // 得到的结果 应该追加到artciles数据
      this.articles.push(...data.results) // 上拉加载触发时,将数据追到队尾
      // 关闭上拉加载的状态
      this.upLoading = false
      // 如何来判断 已经上拉加载 把所有的数据全都查询过来了?
      // 接口并没有告诉我们 什么时候结束  可以根据当前 返回的数据 是否有记录
      // 如果你返回的查询记录是 0 我此时认为 没有下一页的数据了
      if (data.results.length) {
        // 我认为是有下一页数据的
        this.page.page++ // 如果有下一页 应该把页码切到下一页
      } else {
        // 否则是没有下一页的
        this.finished = true // game is over  没有数据了
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
