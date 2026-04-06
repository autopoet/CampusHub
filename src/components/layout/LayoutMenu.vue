<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'LayoutMenu' })

const router = useRouter()
const route = useRoute()

const menus = ref([
  { url: '/home/index', name: '首页' },
  { url: '/home/explore', name: '竞赛大厅' }
])

const activeIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/home/index')) return '/home/index'
  return path
})

const handleSelect = (url) => {
  router.push(url)
}
</script>

<template>
  <nav class="navigation-links">
    <div
      v-for="item in menus"
      :key="item.url"
      class="nav-link-item"
      :class="{ active: activeIndex === item.url }"
      @click="handleSelect(item.url)"
    >
      {{ item.name }}
      <div class="active-indicator" v-if="activeIndex === item.url"></div>
    </div>
  </nav>
</template>

<style scoped>
.navigation-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link-item {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-fg-muted);
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link-item:hover {
  background: var(--color-canvas-subtle);
  color: var(--color-fg-default);
}

.nav-link-item.active {
  color: var(--color-accent-fg);
  font-weight: 700;
}

.active-indicator {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  background: var(--color-accent-fg);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(9, 105, 218, 0.4);
}

/* 隐藏移动端 Logo 的冗余 */
@media screen and (max-width: 768px) {
  .navigation-links { display: none; }
}
</style>
