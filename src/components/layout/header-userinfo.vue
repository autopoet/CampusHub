<script setup>
defineOptions({
  name: 'HeaderUserInfo'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, Message, EditPen, User, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()

// 消息数量
const messageCount = ref(5)
const privateMessageCount = ref(3)

// 下拉菜单显示状态
const showDropdown = ref(false)

// 处理退出登录
const handleLogout = () => {
  console.log('退出登录')
  router.push('/login')
}

// 处理个人中心
const handleProfile = () => {
  console.log('进入个人中心')
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
      <span class="icon-text">消息</span>
    </div>

    <!-- 私信图标 -->
    <div class="icon-wrapper">
      <div class="icon-box">
        <el-icon class="info-icon"><Message /></el-icon>
        <span v-if="privateMessageCount > 0" class="badge">{{ privateMessageCount }}</span>
      </div>
      <span class="icon-text">私信</span>
    </div>

    <!-- 创作中心图标 -->
    <div class="icon-wrapper">
      <div class="icon-box">
        <el-icon class="info-icon"><EditPen /></el-icon>
      </div>
      <span class="icon-text">创作中心</span>
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
  gap: 20px;
  flex-shrink: 0;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.icon-wrapper:hover {
  background-color: #f6f6f6;
}

.icon-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon {
  font-size: 20px;
  color: #8590a6;
}

.icon-text {
  font-size: 12px;
  color: #8590a6;
  margin-top: 2px;
  white-space: nowrap;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  min-width: 14px;
  height: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1px solid #fff;
}

.avatar-container {
  position: relative;
  padding: 4px;
}

.avatar-wrapper {
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8e8e8;
  transition: border-color 0.3s;
}

.avatar:hover {
  border-color: #0066ff;
}

.dropdown-menu {
  position: absolute;
  top: 44px;
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 140px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  color: #8590a6;
  white-space: nowrap;
  border-radius: 6px;
  margin: 0 8px;
}

.dropdown-item:hover {
  color: #0066ff;
  background-color: rgba(0, 102, 255, 0.04);
}

.dropdown-item .el-icon {
  font-size: 16px;
  color: #8590a6;
  transition: color 0.3s;
}

.dropdown-item:hover .el-icon {
  color: #0066ff;
}
</style>
