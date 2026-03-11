<script setup>
defineOptions({
  name: 'HeaderItem'
})

import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')

const handleSearch = () => {
  console.log('搜索内容:', searchQuery.value)
}
</script>

<template>
  <div class="header-item">
    <div class="search-wrapper">
      <el-icon class="search-icon"><Search /></el-icon>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索你感兴趣的内容..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
    </div>
  </div>
</template>

<style scoped>
.header-item {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 40px;
  background: var(--color-canvas-subtle);
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent; /* Prepare for focus state */
}

@media screen and (max-width: 768px) {
  .search-wrapper {
    max-width: 180px; /* 手机端搜索框缩短 */
  }
}

.search-wrapper:hover {
  background: var(--color-btn-hover-bg);
}

.search-wrapper:focus-within {
  background: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
  box-shadow: 0 0 0 1px var(--color-accent-fg);
}

.search-icon {
  font-size: 18px;
  color: var(--color-fg-muted);
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-fg-default);
  font-weight: 400;
}

.search-input::placeholder {
  color: var(--color-fg-subtle);
  font-weight: 400;
}
</style>
