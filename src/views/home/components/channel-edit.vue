<template>
  <div class="channel-edit">
      <!-- 我的频道 -->
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 我的频道循环选项 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{index}}</span>
          <van-icon class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <!-- 我的频道的数据 是 当前用户自己的频道(在登录情况下用户自己的频道, 匿名情况下自己的频道 ) -->
    <!-- 可选频道 全部的频道 - 我的频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in 8" :key="index">
          <span class="f12">频道{{index}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editing: false // 正在编辑状态 用这个状态来控制是否显示 删除图标
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
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
}
</style>
