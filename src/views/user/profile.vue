<template>
   <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='编辑资料' right-text="保存" left-arrow @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
