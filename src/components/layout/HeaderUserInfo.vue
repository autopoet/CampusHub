<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound, Message, Star, User, SwitchButton, Sunny, Moon, ArrowRight } from '@element-plus/icons-vue'
import { useMockStore } from '@/stores/mockStore'

defineOptions({
  name: 'HeaderUserInfo'
})

const props = defineProps({
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const router = useRouter()
const store = useMockStore()

// 下拉菜单显示状态
const showDropdown = ref(false)
const showNoticePanel = ref(false)
const showTeamPanel = ref(false)

// 模拟的拉取数据
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
  
  // 初始化加载当前用户的通知
  store.loadNotifications(1)
})

const handleLogout = () => {
  localStorage.removeItem('campus_token')
  store.clearStore()
  router.push('/login')
  emit('close')
}

const handleProfile = () => {
  router.push('/home/profile')
  emit('close')
}

const handleNav = (path) => {
  router.push(path)
  emit('close')
}

// 鼠标悬停逻辑
const handleMouseEnter = () => { if (!props.isMobile) showDropdown.value = true }
const handleMouseLeave = () => { if (!props.isMobile) showDropdown.value = false }
</script>

<template>
  <!-- 移动端视图 -->
  <div v-if="isMobile" class="mobile-user-container">
    <div class="m-user-profile">
      <img src="/avatar.jpg" class="m-avatar" />
      <div class="m-user-meta">
        <div class="m-name">极客学长</div>
        <div class="m-status">CampusHub 黄金会员</div>
      </div>
    </div>

    <div class="m-actions-list">
      <div class="m-action-item" @click="handleNav('/home/notifications')">
        <div class="m-icon-box"><el-icon><ChatDotRound /></el-icon></div>
        <span class="m-label">消息通知</span>
        <span v-if="messageCount > 0" class="m-badge">{{ messageCount }}</span>
        <el-icon class="m-arrow"><ArrowRight /></el-icon>
      </div>
      
      <div class="m-action-item" @click="handleNav('/home/favorites')">
        <div class="m-icon-box"><el-icon><Star /></el-icon></div>
        <span class="m-label">我的收藏</span>
        <el-icon class="m-arrow"><ArrowRight /></el-icon>
      </div>

      <div class="m-action-item" @click="toggleTheme">
        <div class="m-icon-box">
          <el-icon v-if="!isDark"><Moon /></el-icon>
          <el-icon v-else><Sunny /></el-icon>
        </div>
        <span class="m-label">{{ isDark ? '切换浅色模式' : '切换深色模式' }}</span>
      </div>

      <div class="m-divider"></div>

      <div class="m-action-item" @click="handleProfile">
        <div class="m-icon-box"><el-icon><User /></el-icon></div>
        <span class="m-label">个人资料</span>
        <el-icon class="m-arrow"><ArrowRight /></el-icon>
      </div>

      <div class="m-action-item logout" @click="handleLogout">
        <div class="m-icon-box"><el-icon><SwitchButton /></el-icon></div>
        <span class="m-label">退出登录</span>
      </div>
    </div>
  </div>

  <!-- PC端视图 -->
  <div v-else class="header-userinfo">
    <!-- 消息通知 -->
    <div 
      class="icon-wrapper popover-trigger" 
      @mouseenter="showNoticePanel = true" 
      @mouseleave="showNoticePanel = false"
      @click="handleNav('/home/notifications')"
    >
      <div class="icon-box">
        <el-icon class="info-icon"><ChatDotRound /></el-icon>
        <span v-if="messageCount > 0" class="badge">{{ messageCount }}</span>
      </div>
      <span class="icon-text">消息通知</span>

      <transition name="dropdown-fade">
        <div class="rich-dropdown-panel notice-panel" v-show="showNoticePanel">
          <div class="panel-header">
            <span class="panel-title">通知中心</span>
            <span class="panel-action">全部标为已读</span>
          </div>
          <div class="panel-body">
            <div v-for="msg in notifications" :key="msg.id" class="notice-item" :class="{ 'is-unread': !msg.read }">
              <div class="notice-icon"></div>
              <div class="notice-content">
                <p class="notice-text">{{ msg.content }}</p>
                <span class="notice-time">{{ msg.updatedTime }}</span>
              </div>
            </div>
          </div>
          <div class="panel-footer" @click.stop="handleNav('/home/notifications')">查看所有通知</div>
        </div>
      </transition>
    </div>

    <!-- 我的队伍 -->
    <div 
      class="icon-wrapper popover-trigger"
      @mouseenter="showTeamPanel = true" 
      @mouseleave="showTeamPanel = false"
      @click="handleNav('/home/teams')"
    >
      <div class="icon-box">
        <el-icon class="info-icon"><Message /></el-icon>
        <span class="badge green">{{ myTeamsList.length }}</span>
      </div>
      <span class="icon-text">我的队伍</span>

      <transition name="dropdown-fade">
        <div class="rich-dropdown-panel team-panel" v-show="showTeamPanel">
          <div class="panel-header">
            <span class="panel-title">我的队伍</span>
            <span class="panel-action" @click.stop="router.push('/home/index/recruit')">寻找新队伍</span>
          </div>
          <div class="panel-body">
            <div v-for="team in myTeamsList" :key="team.id" class="team-item">
              <div class="team-info-top">
                <span class="team-name">{{ team.name }}</span>
                <span class="team-status" :class="team.status === '招募中' ? 'status-green' : 'status-blue'">{{ team.status }}</span>
              </div>
              <div class="team-info-bottom">
                <span class="team-role">{{ team.role }}</span>
                <span class="team-members">成员: {{ team.members }}/6</span>
              </div>
            </div>
          </div>
          <div class="panel-footer" @click.stop="handleNav('/home/teams')">查看队伍详情</div>
        </div>
      </transition>
    </div>

    <!-- 我的收藏 -->
    <div class="icon-wrapper" @click="router.push('/home/favorites')">
      <div class="icon-box"><el-icon class="info-icon"><Star /></el-icon></div>
      <span class="icon-text">我的收藏</span>
    </div>

    <!-- 主题切换 -->
    <div class="icon-wrapper theme-toggle" @click="toggleTheme">
      <div class="icon-box">
        <el-icon v-if="!isDark" class="info-icon"><Moon /></el-icon>
        <el-icon v-else class="info-icon"><Sunny /></el-icon>
      </div>
      <span class="icon-text">{{ isDark ? '浅色' : '深色' }}</span>
    </div>

    <!-- 头像 -->
    <div class="avatar-container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="avatar-wrapper">
        <img src="/avatar.jpg" alt="头像" class="avatar" />
      </div>
      <div v-show="showDropdown" class="dropdown-menu">
        <div class="dropdown-item" @click="handleProfile">
          <el-icon><User /></el-icon><span>个人中心</span>
        </div>
        <div class="dropdown-item" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon><span>退出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================
   PC 端样式
   ============================ */
.header-userinfo { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.icon-wrapper { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 4px 6px; border-radius: 6px; transition: background 0.2s; }
.icon-wrapper:hover { background: var(--color-canvas-subtle); }
.icon-box { position: relative; display: flex; align-items: center; justify-content: center; }
.info-icon { font-size: 20px; color: var(--color-fg-muted); }
.icon-text { font-size: 11px; color: var(--color-fg-muted); margin-top: 2px; }
.badge { position: absolute; top: -6px; right: -6px; background: #cf222e; color: #fff; font-size: 10px; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--color-canvas-overlay); }
.badge.green { background: #1a7f37; }

.avatar-container { position: relative; padding: 4px; z-index: 2100; }
.avatar { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--color-border-default); cursor: pointer; transition: 0.2s; }
.avatar-container:hover .avatar { border-color: var(--color-accent-fg); }

.dropdown-menu { position: absolute; top: 44px; right: 0; background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 6px; min-width: 160px; z-index: 2200; overflow: hidden; }
.dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; font-size: 14px; font-weight: 500; border-radius: 8px; transition: background 0.2s; }
.dropdown-item:hover { background: var(--color-canvas-subtle); }

.rich-dropdown-panel { position: absolute; top: 50px; right: 0; width: 320px; background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.15); z-index: 2000; overflow: hidden; }
.panel-header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; background: var(--color-canvas-subtle); border-bottom: 1px solid var(--color-border-muted); }
.panel-title { font-size: 14px; font-weight: 700; }
.panel-action { font-size: 12px; color: var(--color-accent-fg); cursor: pointer; }
.panel-body { max-height: 300px; overflow-y: auto; padding: 8px 0; }
.panel-footer { padding: 12px; text-align: center; font-size: 13px; font-weight: 700; color: var(--color-fg-muted); border-top: 1px solid var(--color-border-muted); cursor: pointer; }
.notice-item { display: flex; gap: 12px; padding: 12px 16px; transition: 0.2s; cursor: pointer; border-bottom: 1px solid var(--color-border-subtle); }
.notice-item:last-child { border-bottom: none; }
.notice-item:hover { background: var(--color-canvas-subtle); }
.is-unread { background: var(--color-accent-subtle); }
.notice-icon { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent-fg); margin-top: 6px; flex-shrink: 0; }

.team-item { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; transition: 0.2s; cursor: pointer; border-bottom: 1px solid var(--color-border-subtle); }
.team-item:last-child { border-bottom: none; }
.team-item:hover { background: var(--color-canvas-subtle); }
.team-info-top, .team-info-bottom { display: flex; justify-content: space-between; align-items: center; }
.team-name { font-size: 14px; font-weight: 700; color: var(--color-fg-default); }
.team-status { font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; text-transform: uppercase; }
.status-green { background: rgba(45, 164, 78, 0.1); color: #2da44e; border: 1px solid rgba(45, 164, 78, 0.2); }
.status-blue { background: rgba(9, 105, 218, 0.1); color: var(--color-accent-fg); border: 1px solid rgba(9, 105, 218, 0.2); }
.team-role { font-size: 12px; color: var(--color-fg-muted); }
.team-members { font-size: 11px; color: var(--color-fg-subtle); font-family: 'Fira Code', monospace; }

/* ============================
   移动端视图样式
   ============================ */
.mobile-user-container { display: flex; flex-direction: column; }
.m-user-profile { display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--color-canvas-subtle); border-radius: 16px; margin-bottom: 24px; }
.m-avatar { width: 56px; height: 56px; border-radius: 16px; object-fit: cover; }
.m-user-meta { display: flex; flex-direction: column; gap: 4px; }
.m-name { font-size: 18px; font-weight: 800; color: var(--color-fg-default); }
.m-status { font-size: 12px; color: var(--color-accent-fg); font-weight: 600; }

.m-actions-list { display: flex; flex-direction: column; gap: 8px; }
.m-action-item { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  padding: 16px; 
  border-radius: 14px; 
  cursor: pointer; 
  transition: background 0.2s;
  position: relative;
}
.m-action-item:active { background: var(--color-canvas-subtle); }
.m-icon-box { font-size: 20px; color: var(--color-fg-muted); width: 24px; display: flex; justify-content: center; }
.m-label { font-size: 15px; font-weight: 600; color: var(--color-fg-default); flex: 1; }
.m-badge { background: #cf222e; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.m-arrow { font-size: 16px; color: var(--color-fg-subtle); }
.m-divider { height: 1px; background: var(--color-border-muted); margin: 8px 0; }
.m-action-item.logout { color: var(--color-danger-fg); }
.m-action-item.logout .m-icon-box, .m-action-item.logout .m-label { color: inherit; }

/* 下拉渐变动画 */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }
</style>
