<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LayoutMenu from './LayoutMenu.vue'
import HeaderItem from './HeaderItem.vue'
import HeaderUserInfo from './HeaderUserInfo.vue'

defineOptions({ name: 'LayoutHeader' })

const router = useRouter()

// 移动端菜单控制
const isDrawerOpen = ref(false)

const openDrawer = () => { isDrawerOpen.value = true }
const closeDrawer = () => { isDrawerOpen.value = false }

const handleNavChange = (url) => {
  router.push(url)
  closeDrawer()
}
</script>

<template>
  <div class="header-outer">
    <div class="header-inner">
      <!-- 左：Logo 与 PC 菜单 -->
      <div class="header-left">
        <div class="logo-wrap" @click="router.push('/home/index')">
          <img src="/favicon.svg" class="logo-img" alt="logo" />
          <span class="logo-text">Campus<span class="hub">Hub</span></span>
        </div>
        <div class="pc-menu-wrap">
           <LayoutMenu />
        </div>
      </div>

      <!-- 中：搜索与占位 -->
      <div class="header-center">
        <HeaderItem />
      </div>

      <!-- 右：PC 用户信息与移动端汉堡 -->
      <div class="header-right">
        <div class="pc-user-wrap">
           <HeaderUserInfo />
        </div>
        
        <!-- 移动端汉堡按钮 -->
        <button class="mobile-hamburger" @click="openDrawer">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端响应式面板 (Drawer) -->
    <Teleport to="body">
      <Transition name="drawer-fade">
        <div v-if="isDrawerOpen" class="drawer-overlay" @click.self="closeDrawer">
          <div class="drawer-content">
            <div class="drawer-header">
              <div class="logo-wrap">
                <span class="logo-icon">🚀</span>
                <span class="logo-text">CampusHub</span>
              </div>
              <button class="close-drawer-btn" @click="closeDrawer">×</button>
            </div>
            
            <div class="drawer-body">
              <!-- 用户卡片 -->
              <div class="mobile-user-card">
                 <HeaderUserInfo :isMobile="true" @close="closeDrawer" />
              </div>

              <!-- 导航链接 -->
              <nav class="mobile-nav">
                 <div class="nav-title">主要导航</div>
                 <div class="mobile-nav-items">
                    <button class="m-nav-link" @click="handleNavChange('/home/index/recruit')">组队招募</button>
                    <button class="m-nav-link" @click="handleNavChange('/home/index/share')">干货分享</button>
                    <button class="m-nav-link" @click="handleNavChange('/home/explore')">竞赛日历</button>
                 </div>
              </nav>

              <div class="drawer-footer">
                 <p>© 2026 CampusHub Platform</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.header-outer {
  height: 64px;
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border-muted);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.header-inner {
  width: 100%;
  max-width: 1440px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-right: 24px;
  flex-shrink: 0;
}

.logo-icon { font-size: 24px; }
.logo-text { font-size: 20px; font-weight: 800; color: var(--color-fg-default); letter-spacing: -0.5px; }
.logo-text .hub { color: var(--color-accent-fg); }

.header-left, .header-right { display: flex; align-items: center; }
.header-center { flex: 1; display: flex; justify-content: center; padding: 0 40px; }

.mobile-hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--color-fg-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: 0.2s;
}

/* ============================
   移动端显示切换
   ============================ */
@media screen and (max-width: 1024px) {
  .header-center { display: none; }
}

@media screen and (max-width: 768px) {
  .pc-menu-wrap, .pc-user-wrap { display: none; }
  .mobile-hamburger { display: block; }
  .header-inner { padding: 0 16px; }
  .logo-text { font-size: 18px; }
}

/* ============================
   响应式抽屉 (Drawer) 样式
   ============================ */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2001;
  display: flex;
  justify-content: flex-end;
}

.drawer-content {
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: var(--color-canvas-default);
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border-subtle);
}

.close-drawer-btn {
  font-size: 32px;
  color: var(--color-fg-subtle);
  background: none;
  border: none;
  line-height: 1;
}

.drawer-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.nav-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--color-fg-subtle);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 32px 0 16px;
}

.mobile-nav-items { display: flex; flex-direction: column; gap: 8px; }
.m-nav-link {
  text-align: left;
  padding: 14px 16px;
  background: var(--color-canvas-subtle);
  border-radius: 12px;
  font-weight: 600;
  color: var(--color-fg-default);
  font-size: 15px;
  border: none;
  transition: 0.2s;
}
.m-nav-link:active { background: var(--color-border-default); transform: scale(0.98); }

.drawer-footer { margin-top: auto; padding: 24px 0; color: var(--color-fg-subtle); font-size: 12px; font-weight: 500; text-align: center; }

/* 抽屉动画 */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.3s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-fade-enter-active .drawer-content { animation: slideInRight 0.3s ease-out; }
.drawer-fade-leave-active .drawer-content { animation: slideOutRight 0.3s ease-in; }

@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
</style>
