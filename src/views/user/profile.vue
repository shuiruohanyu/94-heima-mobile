<template>
    <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName= true" :value="user.name" />
      <van-cell is-link title="性别" value='男'/>
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>
    <!-- 放置 头像弹层 -->
     <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 放置昵称的弹层 -->
      <!-- 弹昵称 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <!-- 直接用trim修饰符 去掉 名称的 前后空格 -->
       <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <!-- 放置一个按钮 用来确定关闭弹层 -->
       <van-button block type="info" size='normal' @click="btnName" >确定</van-button>
    </van-popup>
    <!-- 性别弹层 -->
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
         />
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层:
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 控制生日弹层
      minDate: new Date(1900, 1, 1), // 生日组件 选择的最小日期
      maxDate: new Date(), // 最大时间 当前时间
      currentDate: new Date(), // 当弹出层时 显示的时间 是今天
      actions: [{ name: '男' }, { name: '女' }], // 数组 表示弹层中的选项
      nameMsg: '', // 错误信息
      user: {
        // 放置个人资料信息
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    btnName () {
      // 关闭弹层
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 此时说明长度不对 不符合要求
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return // 不能够再继续
      }
      this.nameMsg = '' // 直接将错误信息清空
      this.showName = false
    }
  }
}
</script>

<style>

</style>
