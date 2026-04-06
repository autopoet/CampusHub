<script setup>
import { computed } from 'vue'
import { useMockStore } from '@/stores/mockStore'
import { ChatDotRound, Delete } from '@element-plus/icons-vue'

const store = useMockStore()
const notifications = computed(() => store.notifications)

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}
</script>

<template>
  <div class="notifications-container">
    <div class="page-header">
      <h2 class="page-title">通知中心 // NOTIFICATIONS</h2>
      <button class="gh-btn-subtle" @click="markAllRead">全部标为已读</button>
    </div>

    <div class="notice-list modern-panel">
      <div v-if="notifications.length === 0" class="empty-state">
        <el-icon class="empty-icon"><ChatDotRound /></el-icon>
        <p>暂时没有新通知，请保持专注 🚀</p>
      </div>

      <div v-for="msg in notifications" :key="msg.id" class="notice-card" :class="{ 'is-unread': !msg.read }">
        <div class="type-indicator" :class="'type-' + msg.type"></div>
        <div class="notice-main">
          <p class="notice-content">{{ msg.content }}</p>
          <span class="notice-time">{{ msg.updatedTime }}</span>
        </div>
        <button class="delete-btn"><el-icon><Delete /></el-icon></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-title { font-size: 20px; font-weight: 800; color: var(--color-fg-default); }

.modern-panel { background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 20px; padding: 12px; }
.notice-list { display: flex; flex-direction: column; gap: 8px; }

.notice-card { 
  display: flex; align-items: center; gap: 16px; padding: 20px; 
  border-radius: 12px; transition: 0.2s; position: relative;
  background: var(--color-canvas-default);
}
.notice-card:hover { background: var(--color-canvas-subtle); }
.is-unread { background: var(--color-accent-subtle); border: 1px solid var(--color-accent-subtle); }

.type-indicator { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.type-indicator.type-1 { background: var(--color-accent-fg); box-shadow: 0 0 8px var(--color-accent-fg); }

.notice-main { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.notice-content { font-size: 15px; color: var(--color-fg-default); line-height: 1.5; margin: 0; }
.notice-time { font-size: 12px; color: var(--color-fg-subtle); }

.delete-btn { background: none; border: none; color: var(--color-fg-subtle); cursor: pointer; padding: 8px; border-radius: 8px; opacity: 0; transition: 0.2s; }
.notice-card:hover .delete-btn { opacity: 1; }
.delete-btn:hover { color: var(--color-danger-fg); background: var(--color-danger-subtle); }

.empty-state { padding: 80px 0; text-align: center; color: var(--color-fg-subtle); }
.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }

.gh-btn-subtle { background: var(--color-canvas-subtle); border: none; padding: 8px 16px; border-radius: 10px; font-weight: 600; color: var(--color-fg-muted); }
.gh-btn-subtle:hover { background: var(--color-border-subtle); color: var(--color-fg-default); }
</style>
