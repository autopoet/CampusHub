<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LayoutHeader from './LayoutHeader.vue'
import CommandPalette from '../ui/CommandPalette.vue'

const showBackTop = ref(false)

const checkScroll = () => {
  showBackTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <div class="layout-container">
    <el-container>
      <el-header class="layout-header">
        <LayoutHeader></LayoutHeader>
      </el-header>
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>

    <!-- 全局快捷命令面板 (Cmd+K) -->
    <CommandPalette />

    <!-- 返回顶部浮动按钮 -->
    <Transition name="fade-bounce">
      <button v-show="showBackTop" class="back-top-btn" @click="scrollToTop" title="返回顶部">
        <svg viewBox="0 0 24 24" width="20" height="20" transform="rotate(-90)"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
      </button>
    </Transition>
  </div>
</template>

<style>
/* 强制覆盖 Element Plus 布局组件的白色背景（非 scoped 才能穿透） */
.el-container,
.el-main,
.el-header,
.el-aside,
.el-footer {
  background-color: transparent !important;
}
</style>

<style scoped>
.layout-container {
  background-color: var(--color-canvas-subtle);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.layout-header {
  background-color: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border-default);
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px !important;
  padding: 0 20px;
  box-shadow: 0 1px 0 var(--color-border-default),
              0 2px 20px -8px rgba(0, 0, 0, 0.06);
}

.layout-main {
  padding: 0;
  background-color: transparent;
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media screen and (max-width: 768px) {
  .layout-header {
    padding: 0 10px;
  }
}

/* 返回顶部按钮 */
.back-top-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  color: var(--color-fg-default);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-top-btn:hover {
  transform: translateY(-4px);
  background: var(--color-canvas-subtle);
  color: var(--color-accent-fg);
  border-color: var(--color-accent-fg);
  box-shadow: 0 12px 24px rgba(9, 105, 218, 0.15);
}

/* 浮动出现动画 */
.fade-bounce-enter-active,
.fade-bounce-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-bounce-enter-from,
.fade-bounce-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

@media screen and (max-width: 768px) {
  .back-top-btn {
    bottom: 24px;
    right: 24px;
    width: 40px;
    height: 40px;
  }
}
</style>
