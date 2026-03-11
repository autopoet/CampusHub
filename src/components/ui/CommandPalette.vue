<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isVisible = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInput = ref(null)

const commands = [
  { id: 'recruit', icon: '🤝', title: '招募大厅', desc: '寻找你的技术战友', path: '/home/index/recruit' },
  { id: 'share', icon: '📚', title: '干货分享', desc: '学习与沉淀技术', path: '/home/index/share' },
  { id: 'explore', icon: '🌍', title: '竞赛大厅', desc: '浏览最新比赛信息', path: '/home/explore' },
  { id: 'profile', icon: '👤', title: '个人中心', desc: '管理你的技能配置', path: '/home/profile' },
  { id: 'publish', icon: '✏️', title: '快速发布', desc: '发布新的招募或分享', action: 'publish' }
]

const filteredCommands = ref([...commands])

const handleKeydown = (e) => {
  // Cmd+K or Ctrl+K to toggle
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isVisible.value = !isVisible.value
    if (isVisible.value) {
      searchQuery.value = ''
      filterCommands()
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
  }

  if (!isVisible.value) return

  if (e.key === 'Escape') {
    closePalette()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % filteredCommands.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + filteredCommands.value.length) % filteredCommands.value.length
  } else if (e.key === 'Enter' && filteredCommands.value.length > 0) {
    e.preventDefault()
    executeCommand(filteredCommands.value[selectedIndex.value])
  }
}

const filterCommands = () => {
  const query = searchQuery.value.toLowerCase()
  filteredCommands.value = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query) || cmd.desc.toLowerCase().includes(query)
  )
  selectedIndex.value = 0
}

const executeCommand = (cmd) => {
  closePalette()
  if (cmd.path) {
    router.push(cmd.path)
  } else if (cmd.action === 'publish') {
    // 假设存在一个全局事件或我们将其暂不处理，依赖后续的注入逻辑
    // 这里简单弹个提示或跳转默认大厅然后打开
    // 因为这是全局组件，最安全的做法是派发自定义事件给上层，
    // 但为了简洁，如果在 /home 路径下，可以直接用 DOM 派发
    const event = new CustomEvent('open-publish')
    window.dispatchEvent(event)
  }
}

const closePalette = () => {
  isVisible.value = false
  searchQuery.value = ''
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="palette-fade">
      <div v-if="isVisible" class="palette-overlay" @click.self="closePalette">
        <div class="palette-container">
          
          <div class="search-header">
            <svg class="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input 
              ref="searchInput"
              v-model="searchQuery" 
              @input="filterCommands"
              class="search-input" 
              type="text" 
              placeholder="搜索页面或操作..." 
            />
            <div class="esc-hint">ESC 退出</div>
          </div>

          <div class="cmd-list" v-if="filteredCommands.length > 0">
            <div 
              v-for="(cmd, index) in filteredCommands" 
              :key="cmd.id"
              class="cmd-item"
              :class="{ 'is-selected': index === selectedIndex }"
              @mouseenter="selectedIndex = index"
              @click="executeCommand(cmd)"
            >
              <div class="cmd-icon">{{ cmd.icon }}</div>
              <div class="cmd-info">
                <div class="cmd-title">{{ cmd.title }}</div>
                <div class="cmd-desc">{{ cmd.desc }}</div>
              </div>
              <div class="cmd-shortcut" v-if="index === selectedIndex">
                <svg viewBox="0 0 24 24" class="enter-icon"><path fill="currentColor" d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7z"/></svg>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <p>未找到匹配的结果</p>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.palette-container {
  width: 100%;
  max-width: 600px;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-muted);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-default);
}

.search-icon {
  width: 24px;
  height: 24px;
  color: var(--color-fg-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0 16px;
  font-size: 18px;
  color: var(--color-fg-default);
  outline: none;
}
.search-input::placeholder {
  color: var(--color-fg-subtle);
}

.esc-hint {
  font-size: 12px;
  color: var(--color-fg-muted);
  background: var(--color-canvas-subtle);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--color-border-default);
  font-family: monospace;
}

.cmd-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
}

.cmd-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cmd-item.is-selected {
  background: var(--color-accent-subtle);
}

.cmd-icon {
  font-size: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-canvas-subtle);
  border-radius: 10px;
  transition: all 0.2s;
}

.cmd-item.is-selected .cmd-icon {
  background: var(--color-canvas-default);
  box-shadow: 0 4px 12px rgba(9, 105, 218, 0.15);
}

.cmd-info {
  flex: 1;
}

.cmd-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-fg-default);
  margin-bottom: 2px;
}

.cmd-item.is-selected .cmd-title {
  color: var(--color-accent-fg);
}

.cmd-desc {
  font-size: 13px;
  color: var(--color-fg-muted);
}

.cmd-shortcut {
  color: var(--color-accent-fg);
  display: flex;
  align-items: center;
}
.enter-icon { width: 18px; height: 18px; }

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--color-fg-muted);
  font-size: 14px;
}

/* Animations */
.palette-fade-enter-active,
.palette-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.palette-fade-enter-from,
.palette-fade-leave-to {
  opacity: 0;
}

.palette-fade-enter-from .palette-container {
  transform: scale(0.96) translateY(-10px);
}
.palette-fade-leave-to .palette-container {
  transform: scale(0.96) translateY(10px);
}
</style>
