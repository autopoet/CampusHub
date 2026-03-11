<template>
  <div class="skeleton-card">
    <div class="skeleton-header">
      <div class="skeleton-avatar skeleton-shimmer"></div>
      <div class="skeleton-author-info">
        <div class="skeleton-line short skeleton-shimmer"></div>
        <div class="skeleton-line x-short skeleton-shimmer"></div>
      </div>
    </div>
    <div class="skeleton-title skeleton-line skeleton-shimmer"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-shimmer"></div>
      <div class="skeleton-line skeleton-shimmer"></div>
      <div class="skeleton-line last skeleton-shimmer"></div>
    </div>
    <div class="skeleton-footer">
      <div class="skeleton-btn skeleton-shimmer"></div>
      <div class="skeleton-btn skeleton-shimmer"></div>
      <div class="skeleton-btn skeleton-shimmer"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  padding: 20px;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  margin-bottom: 12px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-author-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background-color: var(--color-canvas-subtle);
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
}

.skeleton-line.short { width: 30%; }
.skeleton-line.x-short { width: 15%; height: 8px; }
.skeleton-line.last { width: 60%; }

.skeleton-title {
  height: 20px;
  margin-bottom: 16px;
  width: 80%;
}

.skeleton-content {
  margin-bottom: 20px;
}

.skeleton-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.skeleton-btn {
  width: 80px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--color-canvas-subtle);
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
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  /* 在浅色模式下使用暗色光，在暗色模式下使用亮色光 */
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.1) 50%,
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
