<script setup>
import LayoutHeader from './LayoutHeader.vue';
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
  height: 60px !important;
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
</style>
