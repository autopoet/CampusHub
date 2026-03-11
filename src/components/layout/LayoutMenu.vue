<script setup>
defineOptions({
  name: 'LayoutMenu'
})

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const useMenus = ref([
  {
    url: '/home/index',
    name: '首页'
  },
  {
    url: '/home/explore',
    name: '竞赛大厅' // 将发现修改为大厅
  }
])

// 根据当前路由动态设置激活的菜单项
const activeIndex = computed(() => {
  const path = route.path
  // 如果当前路径以 /home/index 开头，则激活首页菜单
  if (path.startsWith('/home/index')) {
    return '/home/index'
  }
  return path
})

const handleSelect = (key) => {
  console.log('选择了菜单:', key)
  router.push(key)
}
</script>

<template>
  <div class="menu-container">
    <div class="logo" @click="handleSelect('/home/index')">
      <svg class="brand-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L4 12L20 20L36 12L20 4Z" fill="url(#paint0_linear)" fill-opacity="0.8"/>
        <path d="M4 28L20 36L36 28V16L20 24L4 16V28Z" fill="url(#paint1_linear)"/>
        <path d="M4 20L20 28L36 20" stroke="var(--color-accent-fg)" stroke-width="2" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="paint0_linear" x1="20" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3B82F6"/>
            <stop offset="1" stop-color="#8B5CF6"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="20" y1="16" x2="20" y2="36" gradientUnits="userSpaceOnUse">
            <stop stop-color="#8B5CF6" stop-opacity="0.2"/>
            <stop offset="1" stop-color="#3B82F6" stop-opacity="0.05"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="logo-text">CampusHub</span>
    </div>
    <nav class="custom-menu">
      <div
        v-for="item in useMenus"
        :key="item.url"
        class="menu-item"
        :class="{ active: activeIndex === item.url }"
        @click="handleSelect(item.url)"
      >
        {{ item.name }}
      </div>
    </nav>
  </div>
</template>

<style scoped>
.menu-container {
  display: flex;
  align-items: center;
  height: 60px;
}

.logo {
  cursor: pointer;
  margin-right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logo:hover .brand-icon {
  transform: rotate(-10deg) scale(1.1);
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-fg-default);
  letter-spacing: -1px;
  background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.custom-menu {
  display: flex;
  align-items: center;
}

.menu-item {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-fg-muted);
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.menu-item:hover {
  color: var(--color-fg-default);
}

.menu-item.active {
  color: var(--color-fg-default);
  font-weight: 600;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 2px;
  background-color: var(--color-accent-fg);
  box-shadow: 0 0 10px var(--color-accent-fg);
}
</style>
