<script setup>
defineOptions({
  name: 'HeaderUserInfo'
})

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, Message, Star, User, SwitchButton, Sunny, Moon } from '@element-plus/icons-vue'
import { useMockStore } from '@/stores/mockStore'

const router = useRouter()
const store = useMockStore()

// 下拉菜单显示状态
const showDropdown = ref(false)
const showNoticePanel = ref(false)
const showTeamPanel = ref(false)

// 模拟的拉取数据
// 使用 store 中的状态替代本地硬编码
const notifications = computed(() => store.notifications)
const messageCount = computed(() => store.notifications.filter(n => !n.read).length)

const myTeamsList = ref([
  { id: 1, name: 'Web3 骇客马拉松', role: '队长', status: '招募中', members: 3 },
  { id: 2, name: '大创：校园二手书交易平台', role: '前端架构', status: '进行中', members: 5 }
])

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
  
  // 核心：初始化加载当前用户的通知 (假设当前用户 ID 为 1)
  store.loadNotifications(1)
})

// 处理退出登录
const handleLogout = () => {
  console.log('退出登录: 清理凭证')
  localStorage.removeItem('campus_token') // 关键：移除 Token 避免重入
  store.clearStore() // 清理 Pinia 状态防止数据残留
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
    <!-- 消息通知面板 -->
    <div 
      class="icon-wrapper popover-trigger" 
      @mouseenter="showNoticePanel = true" 
      @mouseleave="showNoticePanel = false"
    >
      <div class="icon-box">
        <el-icon class="info-icon"><ChatDotRound /></el-icon>
        <span v-if="messageCount > 0" class="badge">{{ messageCount }}</span>
      </div>
      <span class="icon-text">消息通知</span>

      <!-- 通知下拉面板 -->
      <transition name="dropdown-fade">
        <div class="rich-dropdown-panel notice-panel" v-show="showNoticePanel">
          <div class="panel-header">
            <span class="panel-title">通知中心</span>
            <span class="panel-action">全部标为已读</span>
          </div>
          <div class="panel-body">
            <div 
              v-for="msg in notifications" 
              :key="msg.id" 
              class="notice-item"
              :class="{ 'is-unread': !msg.read }"
            >
              <div class="notice-icon" :class="'type-' + msg.type"></div>
              <div class="notice-content">
                <p class="notice-text">{{ msg.content }}</p>
                <span class="notice-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>
          <div class="panel-footer">查看所有通知</div>
        </div>
      </transition>
    </div>

    <!-- 我的队伍面板 -->
    <div 
      class="icon-wrapper popover-trigger"
      @mouseenter="showTeamPanel = true" 
      @mouseleave="showTeamPanel = false"
    >
      <div class="icon-box">
        <el-icon class="info-icon"><Message /></el-icon>
        <span class="badge" style="background-color: var(--color-success-fg);">{{ myTeamsList.length }}</span>
      </div>
      <span class="icon-text">我的队伍</span>

      <!-- 队伍下拉面板 -->
      <transition name="dropdown-fade">
        <div class="rich-dropdown-panel team-panel" v-show="showTeamPanel">
          <div class="panel-header">
            <span class="panel-title">我的队伍</span>
            <span class="panel-action" @click="router.push('/home/recruit')">寻找新队伍</span>
          </div>
          <div class="panel-body">
            <div v-for="team in myTeamsList" :key="team.id" class="team-item">
              <div class="team-info-top">
                <span class="team-name">{{ team.name }}</span>
                <span class="team-status" :class="team.status === '招募中' ? 'status-green' : 'status-blue'">
                  {{ team.status }}
                </span>
              </div>
              <div class="team-info-bottom">
                <span class="team-role">{{ team.role }}</span>
                <span class="team-members">成员: {{ team.members }}/6</span>
              </div>
            </div>
            <div v-if="myTeamsList.length === 0" class="empty-panel">
              尚未加入任何队伍
            </div>
          </div>
          <div class="panel-footer" @click="handleProfile">查看个人主页</div>
        </div>
      </transition>
    </div>

    <!-- 我的收藏 -->
    <div class="icon-wrapper" @click="router.push('/home/favorites')">
      <div class="icon-box">
        <el-icon class="info-icon"><Star /></el-icon>
      </div>
      <span class="icon-text">我的收藏</span>
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
        <img src="/avatar.jpg" alt="头像" class="avatar" />
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
  z-index: 2000; /* 确保高于通知面板 */
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
  top: 38px; /* 向上移动 2px 增加 hover 覆盖面积，防止闪烁 */
  right: 0;
  background-color: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
  padding: 4px 0;
  min-width: 160px;
  z-index: 2100;
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

/* 富交互下拉面板 (通知 & 队伍) */
.popover-trigger {
  position: relative;
}

.rich-dropdown-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: -60px; /* 偏向左侧展现 */
  width: 340px;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: default;
}

[data-theme='dark'] .rich-dropdown-panel {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

/* 顶部小三角指标 */
.rich-dropdown-panel::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: var(--color-canvas-default);
  border-left: 1px solid var(--color-border-default);
  border-top: 1px solid var(--color-border-default);
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-canvas-subtle);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-fg-default);
}

.panel-action {
  font-size: 12px;
  color: var(--color-accent-fg);
  cursor: pointer;
}
.panel-action:hover { text-decoration: underline; }

.panel-body {
  max-height: 320px;
  overflow-y: auto;
  padding: 8px 0;
}

/* 滚动条美化 */
.panel-body::-webkit-scrollbar { width: 4px; }
.panel-body::-webkit-scrollbar-thumb { background: var(--color-border-default); border-radius: 4px; }

.panel-footer {
  padding: 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-muted);
  border-top: 1px solid var(--color-border-muted);
  cursor: pointer;
  background: var(--color-canvas-subtle);
  transition: color 0.2s;
}
.panel-footer:hover { color: var(--color-accent-fg); }

/* 通知列表项 */
.notice-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  transition: background-color 0.2s;
  cursor: pointer;
}
.notice-item:hover { background-color: var(--color-btn-hover-bg); }
.notice-item.is-unread { background-color: rgba(9, 105, 218, 0.05); }

.notice-icon {
  width: 8px; height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.is-unread .notice-icon { background-color: var(--color-accent-fg); box-shadow: 0 0 8px var(--color-accent-fg); }
.notice-item:not(.is-unread) .notice-icon { background-color: var(--color-border-default); }

.notice-content { display: flex; flex-direction: column; gap: 4px; }
.notice-text { font-size: 13px; color: var(--color-fg-default); line-height: 1.4; margin: 0; }
.notice-time { font-size: 11px; color: var(--color-fg-subtle); }

/* 队伍列表项 */
.team-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-subtle);
  cursor: pointer;
  transition: background-color 0.2s;
}
.team-item:last-child { border-bottom: none; }
.team-item:hover { background-color: var(--color-btn-hover-bg); }

.team-info-top, .team-info-bottom { display: flex; justify-content: space-between; align-items: center; }
.team-name { font-size: 14px; font-weight: 600; color: var(--color-fg-default); }
.team-status { font-size: 11px; padding: 2px 6px; border-radius: 12px; }
.status-green { background: rgba(45, 164, 78, 0.1); color: #2da44e; }
.status-blue { background: rgba(9, 105, 218, 0.1); color: var(--color-accent-fg); }

.team-role { font-size: 12px; color: var(--color-fg-muted); }
.team-members { font-size: 12px; color: var(--color-fg-subtle); display: flex; align-items: center; gap: 4px; }

.empty-panel {
  padding: 32px 0;
  text-align: center;
  color: var(--color-fg-subtle);
  font-size: 13px;
}

/* 动画 */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
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
