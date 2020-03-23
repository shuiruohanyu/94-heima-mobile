<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索组件 -->
    <van-search @search="onSearch"  v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想内容  有输入内容时 显示联想 -->
    <van-cell-group class="suggest-box" v-if="q" >
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分  你搜索的内容 会在这里记录 -->
    <!-- <div class="history-box" v-if="!q"> -->
      <!-- 如果没有历史记录 隐藏掉  -->
    <div class="history-box" v-else>
      <!-- 只有当历史记录存在的时候 才显示头部 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空操作 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <!-- 需要把 这个位置变成动态的 -->
        <van-cell @click="toSearchResult(item)" v-for="(item,index) in historyList" :key="index">
          <!-- 显示循环内容 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 注册点击叉号的事件 -->
          <!-- 此时时间冒泡了  js event.stopPagintion() -->
          <!-- vue中可以用修饰符 直接阻止冒泡 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hm-94-toutiao-history' // 此key用来作为 历史记录在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      // 当data初始化的时候 会读取后面数据
      // ["葡萄干","动漫","马云"]
      historyList: JSON.parse(localStorage.getItem(key) || '[]')// 作为一个数据变量 接收 搜索历史记录
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      // 删除要先在data中删除数据 然后把data中的数据同步到 本地缓存中
      this.historyList.splice(index, 1) // 直接删除对应的历史记录数据
      // 将数据同步到 本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 跳到搜索结果页
    toSearchResult (text) {
      // 跳转到搜索结果页?
      // this.$router 路由对象实例
      // this.$route 当前的路由页面对象信息  当前地址 params参数  query参数 fullPath
      // 路由传参 params query
      //   this.$router.push('/search/result?q=' + text) // 采用query传递参数  地址拼接参数
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 清空历史记录
    async clear () {
      // 直接清空历史记录
      // 一般来说 删除所有内容之前
      // 本身也支持promise
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有历史记录吗'
        })
        // 会执行下面的代码
        this.historyList = [] // 将本地历史记录设置为空
        localStorage.setItem(key, '[]') // 同步设置历史记录为空
      } catch (error) {
        // 失败不需要处理
      }
    },
    onSearch () {
      // 首先判断的搜索内容为空 为空 直接返回
      if (!this.q) return
      // 应该在跳转之前 应该把搜索的结果 添加到历史记录
      // 这里要去重 set
      this.historyList.push(this.q) // 将搜索内容加入到历史记录
      this.historyList = Array.from(new Set(this.historyList)) // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 设置到本地缓存
      // 搜索事件触发的时候 应该跳到 搜索结果页 并且携带 参数
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
  // created () {
  //   // 钩子函数 实例初始化之后
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
