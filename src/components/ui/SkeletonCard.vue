<template>
  <article class="skeleton-card">
    <div class="card-accent-bar skeleton-shimmer"></div>
    
    <header class="feed-header">
      <div class="header-main">
        <div class="skeleton-avatar skeleton-shimmer"></div>
        <div class="header-text">
          <div class="skeleton-line skeleton-shimmer" style="width: 80px; height: 14px; margin-bottom: 6px;"></div>
          <div class="skeleton-line skeleton-shimmer" style="width: 50px; height: 12px;"></div>
        </div>
      </div>
      <div class="feed-source">
        <div class="skeleton-line skeleton-shimmer" style="width: 60px; height: 12px; margin: 0;"></div>
      </div>
    </header>

    <main class="feed-main">
      <div class="skeleton-line skeleton-shimmer" style="width: 70%; height: 20px; margin-bottom: 12px;"></div>
      
      <div class="feed-desc">
        <div class="skeleton-line skeleton-shimmer" style="width: 100%; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 85%; height: 14px; margin-bottom: 8px;"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 60%; height: 14px; margin-bottom: 16px;"></div>
      </div>
      
      <div class="feed-tags">
        <div class="skeleton-tag skeleton-shimmer"></div>
        <div class="skeleton-tag skeleton-shimmer" style="width: 60px;"></div>
        <div class="skeleton-tag skeleton-shimmer" style="width: 80px;"></div>
      </div>
    </main>

    <footer class="feed-footer">
      <div class="footer-stats">
        <div class="skeleton-line skeleton-shimmer" style="width: 40px; height: 14px;"></div>
        <div class="skeleton-line skeleton-shimmer" style="width: 40px; height: 14px;"></div>
      </div>
      
      <div class="footer-actions">
        <div class="skeleton-btn skeleton-shimmer"></div>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.skeleton-card {
  position: relative;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-accent-bar {
  height: 4px;
  width: 100%;
  background: var(--color-border-muted);
}

.feed-header {
  padding: 16px 20px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-canvas-subtle);
}

.feed-main {
  padding: 0 20px;
  flex: 1;
}

.feed-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.skeleton-tag {
  height: 24px;
  width: 50px;
  border-radius: 12px;
  background-color: var(--color-canvas-subtle);
}

.feed-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border-default);
  background: var(--color-canvas-subtle);
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.skeleton-btn {
  width: 80px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--color-border-muted);
}

.skeleton-line {
  background-color: var(--color-canvas-subtle);
  border-radius: 4px;
}

/* 高级扫光动画 */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--color-canvas-subtle);
}

.skeleton-shimmer::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
  transform: translateX(-100%);
}

/* 暗色模式适配 */
[data-theme='dark'] .skeleton-shimmer::after {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
