<template>
    <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" @click-right="saveUser" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName= true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender = true" :value="user.gender === 0 ? '男' : '女' "/>
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 放置 头像弹层 -->
     <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
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
    <!-- 性别弹层  注册性别弹层的选择事件-->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirmDate"
          @cancel="showBirthDay=false"
         />
    </van-popup>
    <!-- 放置一个input:file 标签 用来上传图片  不能让人看到 隐藏掉 -->
    <!-- vue中 可以通过 ref获取对象 -->
    <!-- 如果选择了文件 就会触发input change事件 -->
    <input @change="upload" ref="myFile" type="file" style="display:none" name="" id="">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user'
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
        birthday: '2002-01-01', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    // 保存用户信息
    async saveUser () {
      try {
        await saveUserInfo(this.user) // 传入user对象
        this.$gnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$gnotify({ message: '保存失败' })
      }
    },
    // 打开选择文件的对话框 触发点击input:file的动作
    openFileDialog () {
      this.$refs.myFile.click() // 触发input:file的click事件 触发事件就会弹出文件对话框
    },
    // 封装方法
    async  getUserProfile () {
      this.user = await getUserProfile()
    },
    btnName () {
      // 关闭弹层
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 此时说明长度不对 不符合要求
        this.nameMsg = '用户昵称的长度应该是1-7的长度要求'
        return // 不能够再继续
      }
      this.nameMsg = '' // 直接将错误信息清空
      this.showName = false
    },
    selectItem (item, index) {
      this.user.gender = index
      // 手动关闭 弹层
      this.showGender = false
      // index 0 男  1 女
      // 通过item或者 index可以得到 点击的是男或者是女
    },
    // 显示生日弹层
    showDate () {
      this.showBirthDay = true // 显示生日弹层
      // 将当前的生日 设置到 选择日期的当前时间  将生日字符串 转化成Date对象 绑定到 日期组件上
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
      //  当前选择的生日 其实就是 currenDate
      // 拿到选择的日期  设置给生日  => date  => 字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD') // 将date类型转化成字符串
      this.showBirthDay = false // 关闭弹层
    },
    // 修改头像
    async  upload (params) {
      //  当选择 完头像之后 就可以修改头像
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数 是 选择的图片文件 选择图片文件
      const result = await updatePhoto(data) // 上传头像
      this.user.photo = result.photo // 把成功上传的头像地址设置给当前data中的数据
      this.showPhoto = false // 关闭头像弹层
    }
  },
  created () {
    this.getUserProfile() // 获取用户资料
  }
}
</script>

<style>

</style>
