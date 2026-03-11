<script setup>
defineOptions({ name: 'HomeView' })

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeSidebar from './HomeSidebar.vue'

const router = useRouter()
const route = useRoute()

const tabs = ref([
  { url: '/home/index/recruit', name: '招募大厅', icon: '🤝', desc: '寻找你的队友' },
  { url: '/home/index/share', name: '干货分享', icon: '📚', desc: '学习与沉淀' }
])

const activeTab = computed(() => route.path)

const handleTabClick = (url) => {
  router.push(url)
}
</script>

<template>
  <div class="home-view">
    <!-- 顶部 Hero 横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="dot"></span>
          <span>竞赛季进行中 · 2026 春季</span>
        </div>
        <h1 class="hero-title">在这里找到你的<br/><span class="gradient-text">极客战友</span></h1>
        <p class="hero-sub">CampusHub 连接校园技术精英，让每一次比赛都有靠谱的队友陪你冲刺。</p>
      </div>
      <!-- 背景装饰粒子/网格 -->
      <div class="hero-grid"></div>
    </div>

    <!-- 主内容区 -->
    <div class="main-wrapper">
      <!-- 左侧列表区 -->
      <div class="content-col">
        <!-- Tab 导航 -->
        <div class="tab-bar">
          <button
            v-for="tab in tabs"
            :key="tab.url"
            class="tab-btn"
            :class="{ 'is-active': activeTab === tab.url }"
            @click="handleTabClick(tab.url)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-name">{{ tab.name }}</span>
          </button>
        </div>

        <!-- 内容容器 -->
        <div class="content-body">
          <router-view></router-view>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <aside class="sidebar-col">
        <HomeSidebar />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: calc(100vh - 60px);
}

/* ============================
   Hero Banner
   ============================ */
.hero-banner {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  padding: 48px 24px 52px;
  overflow: hidden;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}

/* 网格背景 */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #c4b5fd;
  margin-bottom: 20px;
}

.dot {
  width: 7px;
  height: 7px;
  background: #a78bfa;
  border-radius: 50%;
  animation: pulse-dot 2s ease infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(167, 139, 250, 0); }
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  color: #f1f5f9;
  line-height: 1.25;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.gradient-text {
  background: linear-gradient(90deg, #818cf8, #c084fc, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 15px;
  color: #94a3b8;
  max-width: 480px;
  line-height: 1.7;
}

/* ============================
   Main Layout
   ============================ */
.main-wrapper {
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

/* ============================
   Tab Bar
   ============================ */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 6px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--color-fg-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-btn:hover {
  background: var(--color-canvas-subtle);
  color: var(--color-fg-default);
}

.tab-btn.is-active {
  background: var(--color-accent-fg);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(9, 105, 218, 0.3);
}

.tab-icon {
  font-size: 16px;
}

/* Content body - 不设固定height，让内容自然撑开 */
.content-col {
  min-width: 0;
}

.content-body {
  /* 自然流动 */
}

/* 侧边栏粘性定位 */
.sidebar-col {
  position: sticky;
  top: 84px;
}

/* ============================
   Responsive
   ============================ */
@media screen and (max-width: 1024px) {
  .main-wrapper {
    grid-template-columns: 1fr;
    max-width: 700px;
  }
  .sidebar-col {
    display: none;
  }
}

@media screen and (max-width: 768px) {
  .hero-banner {
    padding: 32px 20px 36px;
  }
  .hero-title {
    font-size: 28px;
  }
  .main-wrapper {
    padding: 16px;
    gap: 16px;
  }
  .tab-bar {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-radius: 10px;
  }
}
</style>
