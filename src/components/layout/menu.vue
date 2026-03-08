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
    url: '/home/education',
    name: '知乎知学堂'
  },
  {
    url: '/home/explore',
    name: '发现'
  },
  {
    url: '/home/waiting',
    name: '等你来答'
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
      <img src="/src/assets/image/logo.png" alt="">
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
  background-color: transparent;
}

.logo {
  cursor: pointer;
  margin-right: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo img {
  width: 80px;
  height: auto;
  display: block;
}

.custom-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.menu-item {
  font-size: 15px;
  font-weight: 500;
  color: #8590a6;
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}

.menu-item:hover {
  color: #0066ff;
  background-color: rgba(0, 102, 255, 0.04);
}

.menu-item.active {
  color: #0066ff;
  font-weight: 600;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  background-color: #0066ff;
  border-radius: 2px 2px 0 0;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>
