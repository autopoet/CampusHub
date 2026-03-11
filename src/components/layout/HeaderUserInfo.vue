<script setup>
defineOptions({
  name: 'HeaderUserInfo'
})

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, Message, User, SwitchButton, Sunny, Moon } from '@element-plus/icons-vue'

const router = useRouter()

// 消息数量
const messageCount = ref(5)
const privateMessageCount = ref(3)

// 下拉菜单显示状态
const showDropdown = ref(false)

// 主题切换逻辑
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// 处理退出登录
const handleLogout = () => {
  console.log('退出登录')
  router.push('/login')
}

// 处理个人中心
const handleProfile = () => {
  router.push('/home/profile')
}

// 鼠标进入头像和下拉菜单区域
const handleMouseEnter = () => {
  showDropdown.value = true
}

// 鼠标离开头像和下拉菜单区域
const handleMouseLeave = () => {
  showDropdown.value = false
}
</script>

<template>
  <div class="header-userinfo">
    <!-- 消息图标 -->
    <div class="icon-wrapper">
      <div class="icon-box">
        <el-icon class="info-icon"><ChatDotRound /></el-icon>
        <span v-if="messageCount > 0" class="badge">{{ messageCount }}</span>
      </div>
      <span class="icon-text">组队通知</span>
    </div>

    <!-- 私信图标 -->
    <div class="icon-wrapper">
      <div class="icon-box">
        <el-icon class="info-icon"><Message /></el-icon>
        <span v-if="privateMessageCount > 0" class="badge">{{ privateMessageCount }}</span>
      </div>
      <span class="icon-text">我的队伍</span>
    </div>

    <!-- 主题切换图标 -->
    <div class="icon-wrapper theme-toggle" @click="toggleTheme">
      <div class="icon-box">
        <el-icon v-if="!isDark" class="info-icon"><Moon /></el-icon>
        <el-icon v-else class="info-icon"><Sunny /></el-icon>
      </div>
      <span class="icon-text">{{ isDark ? '浅色' : '深色' }}</span>
    </div>

    <!-- 个人头像和下拉菜单 -->
    <div class="avatar-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="avatar-wrapper">
        <img src="/src/assets/image/1.png" alt="头像" class="avatar" />
      </div>

      <!-- 下拉菜单 -->
      <div v-show="showDropdown" class="dropdown-menu">
        <div class="dropdown-item" @click="handleProfile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </div>
        <div class="dropdown-item" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-userinfo {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.icon-wrapper:hover {
  background-color: var(--color-canvas-subtle);
}

.icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon {
  font-size: 18px;
  color: var(--color-fg-muted);
}

.icon-text {
  font-size: 11px;
  color: var(--color-fg-muted);
  margin-top: 2px;
  white-space: nowrap;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #cf222e; /* GitHub red */
  color: #ffffff;
  font-size: 9px;
  font-weight: 600;
  min-width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1px solid var(--color-canvas-overlay);
}

.avatar-container {
  position: relative;
  padding: 4px;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border-default);
  transition: border-color 0.2s;
}

.avatar-container:hover .avatar {
  border-color: var(--color-accent-fg);
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 4px 0;
  min-width: 160px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-fg-default);
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-canvas-subtle);
}

.dropdown-item .el-icon {
  font-size: 16px;
  color: var(--color-fg-muted);
}

@media screen and (max-width: 768px) {
  .header-userinfo {
    gap: 8px;
  }

  .icon-text {
    display: none;
  }

  .icon-wrapper {
    padding: 2px;
  }
}
</style>
