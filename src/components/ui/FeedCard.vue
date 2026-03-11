<script setup>
/**
 * FeedCard.vue — 通用列表卡片
 * 使用语义化 article/header/footer 标签
 * 通过 slots 分发内容，通过 props 接收元数据
 */
defineProps({
  author: String,
  action: String,
  time: String,
  title: String,
  loading: Boolean
})

const emit = defineEmits(['click'])
</script>

<template>
  <!-- semantic article element -->
  <article class="feed-card" @click="emit('click')" :class="{ 'is-loading': loading }">
    <!-- 顶部彩色装饰线（纯 CSS，不用伪元素遮挡内容） -->
    <div class="card-accent-bar"></div>

    <header class="card-header">
      <slot name="header">
        <div class="source-info">
          <div class="author-avatar">{{ author ? author[0] : '?' }}</div>
          <span class="author-name">{{ author }}</span>
          <span class="action-text">{{ action }}</span>
          <span class="divider">·</span>
          <time class="time-text">{{ time }}</time>
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

    <footer class="card-footer" @click.stop>
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
  padding: 0;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden; /* 让 accent bar 有圆角 */
}

/* 顶部装饰线 - 不影响内容，是卡片结构的第一个子元素 */
.card-accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent-fg), #8b5cf6);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.feed-card:hover .card-accent-bar {
  transform: scaleX(1);
}

.feed-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-fg);
  box-shadow: 0 12px 32px -8px rgba(9, 105, 218, 0.15);
}

/* 内容区域的 padding 单独设，不受 overflow:hidden 影响 */
.card-header,
.card-main,
.card-footer {
  padding-left: 24px;
  padding-right: 24px;
}

.card-header {
  padding-top: 20px;
  padding-bottom: 0;
}

.card-main {
  padding-top: 12px;
  padding-bottom: 0;
}

.card-footer {
  padding-top: 16px;
  padding-bottom: 20px;
}

/* Source info row */
.source-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-default);
}

.action-text {
  font-size: 13px;
  color: var(--color-fg-muted);
}

.divider {
  color: var(--color-border-default);
}

.time-text {
  font-size: 12px;
  color: var(--color-fg-subtle);
}

/* Title */
.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-fg-default);
  margin: 0 0 10px 0;
  line-height: 1.5;
  transition: color 0.2s;
}

.feed-card:hover .card-title {
  color: var(--color-accent-fg);
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  min-height: 0; /* 没有 tags 时不占空间 */
}

.card-tags:empty {
  display: none;
}

/* Body text */
.card-body {
  font-size: 14px;
  color: var(--color-fg-muted);
  line-height: 1.65;
}

/* Footer */
.card-footer {
  border-top: 1px solid var(--color-border-muted);
}

/* Responsive */
@media screen and (max-width: 768px) {
  .card-header,
  .card-main,
  .card-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  .card-title { font-size: 15px; }
}
</style>
