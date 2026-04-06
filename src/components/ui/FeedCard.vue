<script setup>
/**
 * FeedCard.vue — 通用列表卡片
 * 支持头像图片、自定义标题、标签和底部操作
 */
defineProps({
  author: String,
  avatar: String, // 新增：支持头像图片 URL
  action: String,
  time: String,
  title: String,
  loading: Boolean
})

const emit = defineEmits(['click'])
</script>

<template>
  <article class="feed-card" @click="emit('click')" :class="{ 'is-loading': loading }">
    <div class="card-accent-bar"></div>

    <header class="card-header">
      <slot name="header">
        <div class="source-info">
          <!-- 如果有 avatar 则显示图片，否则显示首字母占位 -->
          <div class="author-avatar-wrap">
            <img v-if="avatar" :src="avatar" class="img-avatar" alt="avatar" />
            <div v-else class="text-avatar">{{ author ? author[0] : '?' }}</div>
          </div>
          
          <div class="source-meta">
            <div class="top-row">
              <span class="author-name">{{ author }}</span>
              <span class="action-text" v-if="action">{{ action }}</span>
            </div>
            <time class="time-text">{{ time }}</time>
          </div>
        </div>
      </slot>
    </header>

    <main class="card-main">
      <slot name="title">
        <h2 class="card-title">{{ title }}</h2>
      </slot>

      <div class="card-tags">
        <slot name="tags"></slot>
      </div>

      <div class="card-body">
        <slot></slot>
      </div>
    </main>

    <footer class="card-footer" @click.stop v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<style scoped>
.feed-card {
  position: relative;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.card-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent-fg), #8b5cf6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feed-card:hover .card-accent-bar {
  transform: scaleX(1);
}

.feed-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-fg);
  box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.12);
}

.card-header, .card-main, .card-footer {
  padding-left: 24px;
  padding-right: 24px;
}

.card-header { padding-top: 20px; }
.card-main { padding-top: 12px; }
.card-footer { padding: 16px 24px 20px; margin-top: 12px; border-top: 1px solid var(--color-border-muted); }

.source-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-border-subtle);
}

.img-avatar { width: 100%; height: 100%; object-fit: cover; }
.text-avatar {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.source-meta { display: flex; flex-direction: column; }
.top-row { display: flex; align-items: center; gap: 6px; }
.author-name { font-size: 14px; font-weight: 700; color: var(--color-fg-default); }
.action-text { font-size: 13px; color: var(--color-fg-muted); }
.time-text { font-size: 12px; color: var(--color-fg-subtle); }

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-fg-default);
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.feed-card:hover .card-title { color: var(--color-accent-fg); }

.card-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.card-tags:empty { display: none; }

.card-body { font-size: 14.5px; color: var(--color-fg-muted); line-height: 1.6; }

@media screen and (max-width: 768px) {
  .card-header, .card-main, .card-footer { padding-left: 16px; padding-right: 16px; }
  .card-title { font-size: 16px; }
}
</style>
