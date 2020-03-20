<template>
  <!-- 文章列表组件  放置列表 -->
  <!-- van-list 可以帮助我们实现上拉加载  需要一些变量 -->
  <!-- 这里放置这个div的目的是 形成滚动条, 因为我们后期要做 阅读记忆 -->
  <!-- 阅读记忆  上次你阅读到哪  回来之后还是哪-->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件 如果不加干涉, 初始化完毕 就会检测 自己距离底部的长度,如果超过了限定 ,就会执行 load事件  自动把
       绑定的 loading 变成true
    -->
    <!-- 下拉刷新组件包裹 列表组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="没有了" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <!-- item.art_id 此时是一个大数字的对象 v-for 的key需要用字符串或者数字代理 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素 文章列表的循环项  无图  单图  三图 -->
            <div class="article_item">
              <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <!-- lazy-load表示 该图片组件 会进行 懒加载 也就是只有当前屏幕出现的之后 才去加载对应的图片 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                 <!-- 单图取第一个 -->
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用过滤器 -->
                <span>{{ item.pubdate | relTime }}</span>
                <!-- 此叉号的显示 应该根据当前的登录状态来判断 如果登录了 可以显示 如果没有登录 不显示 -->
                <!-- 最原始方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
               <!-- 辅助函数的形式 -->
               <!-- @事件名="逻辑处理"  点击事件中触发一个 显示反馈的事件-->
               <span @click="$emit('showAction')" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入获取文章的模块
import { mapState } from 'vuex'
import { getArticles } from '@/api/articles'
export default {
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下载刷新状态 表示是否正在下拉刷新
      upLoading: false, // 表示是否开启了上拉加载 默认值false
      finished: false, // 表示 是否已经完成所有数据的加载
      articles: [], // 文章列表
      timestamp: null // 定义一个时间戳属性 用来存储 历史时间戳
    }
  },
  //  props: ['channel_id'], // 字符串数组 接收方式 比较简单 易于上手

  // props 对象形式 可以约束传入的值 必填 传值类型
  props: {
    // key(props属性名): value(对象 配置)
    channel_id: {
      required: true, // 必填项 此属性的含义 true 要求该 props必须传
      type: Number, // 表示要传入的prop属性的类型
      default: null // 默认值的意思 假如你没有传入 prop属性 默认值 就会被采用
    }
  },
  methods: {
    // onLoad 是会自动执行
    // 上拉加载
    async onLoad () {
      console.log('开始加载文章列表数据')
      // 如果你的数据已经加载完毕 你应该把finished 设置为true 表示一切结束了 不再请求
      // 此时强制的判断总条数 如果超过100条 就直接关闭
      // vant-list组件 第一次加载 需要让 list组件出现滚动条 如果没有滚动条 就没有办法 继续往下拉
      // if (this.articles.length > 50) {
      //   // 如果此时记录已经大于100
      //   this.finished = true // 关闭加载
      // } else {
      //   // 1-60
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载 不是覆盖之前的数据  应该把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据 需要手动的关掉 loading
      //   this.upLoading = false
      // }

      // 下面这么写 依然不能关掉加载状态 为什么 ? 因为关掉之后  检测机制  高度还是不够 还是会开启
      // 如果你有数据 你应该 把数据到加到list中
      // 如果想关掉
      // setTimeout(() => {
      //   this.finished = true // 表示 数据已经全部加载完毕 没有数据了
      // }, 1000) // 等待一秒 然后关闭加载状态
      await this.$sleep() // 人为控制了 请求的时间
      // this.timestamp || Date.now()  如果有历史时间戳 用历史时间戳 否则用当前的时间戳
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // this.channel_id指的是 当前的频道id
      //  获取内容
      this.articles.push(...data.results) // 将数据追加到队尾  这里用...
      this.upLoading = false // 关闭加载状态
      // 将历史时间戳 给timestamp  但是 赋值之前有个判断 需要判断一个历史时间是否为0
      // 如果历史时间戳为 0 说明 此时已经没有数据了 应该宣布 结束   finished true
      if (data.pre_timestamp) {
        // 如果有历史时间戳 表示 还有数据可以继续进行加载
        this.timestamp = data.pre_timestamp
      } else {
        // 表示没有数据可以请求了
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      await this.$sleep() // 人为控制了 请求的时间
      // 下拉刷新应该发送最新的时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 永远传最新的时间戳
      })
      // 手动的关闭 下拉刷新的状态
      this.downLoading = false
      // 需要判断 最新的时间戳能否换来的数据啊  如果能换来数据 把新数据整个替换旧数据 如果不能  就告诉大家 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据
        // 需要将整个的articles替换
        this.articles = data.results // 历史数据全部被覆盖
        // 此时你 已经之前的全部数据覆盖了 假如 你之前把数据拉到了低端 也就意味着 你之前的finished已经为true了
        if (data.pre_timestamp) {
          // 因为下拉刷新 换来了一拨新的数据 里面 又有历史时间戳
          this.finished = false // 重新唤醒列表 让列表可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 如果换不来新数据
        this.successText = '当前已经是最新了'
      }

      // setTimeout(() => {
      //   // 下拉刷新 表示要读取最新的数据 而且最新的数据要添加到数据头部
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 数组添加到头部
      //   this.articles.unshift(...arr)
      //   // 手动关闭正在加载的状态
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
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
