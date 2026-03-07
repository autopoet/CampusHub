<script setup>
import { ref, reactive } from 'vue'
import {useRouter} from 'vue-router'

const activeName = ref('first') //默认选中账号登录

const form = reactive({
  name: '',
  password: '',
  code: ''
})

const router = useRouter();

const onSubmit = () => {
  console.log('登录成功，跳转到首页')
  router.push('/home/index')
}

const onRegister = () => {
  console.log('注册')
}

const handleClick = () => {
  console.log('点击事件')
}
</script>

<template>
  <div class="login">
    <div class="login-top">
      <img src="@/assets/image/v2.png" alt="">
    </div>
    <div class="login-item">
      <div class="loginleft">
        <p class="loginleft-title">打开知乎APP</p>
        <div class="loginleft-erm">
          <img src="@/assets/image/erm.png" alt="">
        </div>
        <p class="loginleft-other">其它扫码方式：微信</p>
        <ul>
          <li><el-button round>下载知乎APP</el-button></li>
          <li><el-button round>开通机构号</el-button></li>
          <li><el-button round>无障碍模式</el-button></li>
        </ul>
      </div>
      <div class="loginright">
        <el-form :model="form" label-width="auto">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="账号登录" name="first">
              <el-input v-model="form.name" placeholder="请输入手机号" />
              <el-input v-model="form.password" placeholder="请输入密码" type="password" />
              <el-link type="primary" @click="handleClick">忘记密码？</el-link>
              <el-button type="primary" @click="onSubmit">登录</el-button>
              <div class="otherwise">
                <p class="other-login-text">选择其他方式登录</p>
                <ul class="social-icons">
                  <li>
                    <!-- 引入微信图标 -->
                    <i class="iconfont icon-weixin"></i>
                  </li>
                  <li>
                     <!-- 引入微博图标 -->
                    <i class="iconfont icon-shejiaotubiao-06"></i>
                  </li>
                  <li>
                    <!-- 引入QQ图标 -->
                    <i class="iconfont icon-QQ"></i>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="注册" name="second">
              <el-input v-model="form.name" placeholder="请输入手机号" />
              <div class="code-input-wrapper">
                <el-input v-model="form.code" placeholder="请输入验证码" class="code-input" />
                <el-button class="code-button" @click="handleClick">获取验证码</el-button>
              </div>
              <el-input v-model="form.password" placeholder="请输入密码" type="password" />
              <el-button type="primary" @click="onRegister" class="register-btn">注册</el-button>
              <p class="agreement-text">注册即代表同意<a href="#" class="agreement-link">《用户协议》</a></p>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 10px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.social-icons li {
  margin-bottom: 0;
}

.social-icons .iconfont {
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.social-icons .iconfont:hover {
  color: #1890ff;
}
</style>
