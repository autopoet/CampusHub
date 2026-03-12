<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const activeName = ref('login')

const form = reactive({
  name: '',
  password: '',
  code: ''
})

const router = useRouter()

const onSubmit = () => {
  if (!form.name || !form.password) {
    alert('请填写学号和密码！')
    return
  }
  console.log('登录成功')
  router.push('/home/index/recruit')
}

const onRegister = () => {
  activeName.value = 'login'
}
</script>

<template>
  <div class="login-page">
    <!-- 动态背景装饰 -->
    <div class="bg-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-header">
      <h1 class="logo-text">CampusHub</h1>
      <p class="logo-subtitle">连接校园精英 开启极客旅程</p>
    </div>

    <div class="login-container">
      <div class="auth-card">
        <div class="auth-tabs">
          <div 
            class="tab-item" 
            :class="{ active: activeName === 'login' }"
            @click="activeName = 'login'"
          >
            登录
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeName === 'register' }"
            @click="activeName = 'register'"
          >
            注册
          </div>
          <div class="tab-ink-bar" :style="{ left: activeName === 'login' ? '0' : '50%' }"></div>
        </div>

        <div class="form-content">
          <transition name="fade-slide" mode="out-in">
            <div v-if="activeName === 'login'" class="form-panel" key="login">
              <div class="form-group">
                <label>学号 / 手机 / 邮箱</label>
                <div class="input-wrapper">
                  <input v-model="form.name" type="text" placeholder="输入您的凭据" />
                  <div class="input-focus-line"></div>
                </div>
              </div>
              <div class="form-group">
                <div class="label-row">
                  <label>安全密码</label>
                  <a href="#" class="forgot-link">找回密码</a>
                </div>
                <div class="input-wrapper">
                  <input v-model="form.password" type="password" placeholder="输入安全密码" />
                  <div class="input-focus-line"></div>
                </div>
              </div>
              <button class="tech-btn primary" @click="onSubmit">
                进入大厅
              </button>
            </div>

            <div v-else class="form-panel" key="register">
              <div class="form-group">
                <label>身份信息</label>
                <div class="input-wrapper">
                  <input v-model="form.name" type="text" placeholder="手机号或学号" />
                  <div class="input-focus-line"></div>
                </div>
              </div>
              <div class="form-group">
                <label>安全验证</label>
                <div class="input-row">
                  <div class="input-wrapper flex-grow">
                    <input v-model="form.code" type="text" placeholder="验证码" />
                    <div class="input-focus-line"></div>
                  </div>
                  <button class="tech-btn ghost small">获取验证码</button>
                </div>
              </div>
              <div class="form-group">
                <label>设置密码</label>
                <div class="input-wrapper">
                  <input v-model="form.password" type="password" placeholder="建议6位以上字符" />
                  <div class="input-focus-line"></div>
                </div>
              </div>
              <button class="tech-btn primary" @click="onRegister">创建并登录</button>
              <p class="terms-text">注册即视为同意 <a href="#">服务条款</a></p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* 动态背景装饰：体现“精灵/动画”技术 */
.bg-decoration {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  border-radius: 50%;
  animation: float 20s infinite alternate ease-in-out;
}

.shape-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  top: -100px; right: -100px;
}

.shape-2 {
  width: 350px; height: 350px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: -50px; left: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-duration: 30s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 60px) scale(1.1); }
}

.login-header {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 40px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #94a3b8;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 400px;
}

/* Glassmorphism：体现高端/技术感 */
.auth-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.auth-tabs {
  display: flex;
  position: relative;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s;
}

.tab-item.active {
  color: #ffffff;
}

.tab-ink-bar {
  position: absolute;
  bottom: -1px;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.form-content {
  overflow: hidden;
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
}

.label-row {
  display: flex;
  justify-content: space-between;
}

.forgot-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
}

.forgot-link:hover { text-decoration: underline; }

.input-wrapper {
  position: relative;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 15px;
  outline: none;
}

.input-wrapper input::placeholder { color: #64748b; }

.input-focus-line {
  position: absolute;
  bottom: -1px; left: 50%; right: 50%;
  height: 2px;
  background: #3b82f6;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(15, 23, 42, 0.8);
}

.input-wrapper:focus-within .input-focus-line {
  left: 12px; right: 12px;
}

.input-row {
  display: flex;
  gap: 12px;
}

.flex-grow { flex: 1; }

.tech-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.tech-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
  filter: brightness(1.1);
}

.tech-btn.primary:active { transform: translateY(0); }

.tech-btn.ghost {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tech-btn.ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.tech-btn.small { padding: 8px 16px; font-size: 13px; }

.terms-text {
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

.terms-text a { color: #3b82f6; text-decoration: none; }

/* 页面切换动画 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 640px) {
  .logo-text { font-size: 32px; }
  .auth-card { padding: 24px; }
}
</style>
