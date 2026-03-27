<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
// ECharts 已移除，改为原生 CSS 控制的 Bento 看板

const userInfo = ref({
  name: '前端小牛',
  role: '前端架构师 / 开发者',
  bio: '对技术充满热情，目前专注于 Vue3 生态与前端性能优化。',
  followers: 128,
  following: 56,
  likes: 1024,
  avatar: '/avatar.jpg'
})

const skills = ref([
  { name: 'Vue 3 / 生态', power: 92, color: '#42b883' },
  { name: 'JavaScript', power: 88, color: '#f7df1e' },
  { name: 'CSS / 动效引擎', power: 85, color: '#38bdf8' },
  { name: 'Node.js', power: 75, color: '#4ade80' }
])

const stackTags = ['Vue3', 'Pinia', 'Vite', 'Element Plus', 'WebGL', 'Three.js', 'Git', 'Webpack', 'Figma', 'TypeScript']

const activeTab = ref('posts')

// Web Worker 引用
let worker = null

onMounted(() => {
  generateHeatmapViaWorker()
})

onUnmounted(() => {
  if (worker) {
    worker.terminate()
  }
})

// 核心战力指标 (用于 Bento 看板)
const geekMetrics = computed(() => [
  ...skills.value.map(s => ({ label: s.name, value: s.power, color: s.color })),
  { label: '工程化', value: 94, color: 'var(--color-accent-fg)' }
])

// ============= 成长历程 =============
const honors = ref([
  {
    id: 1, name: 'Vditor Master', icon: '📝', level: 'Gold',
    desc: '掌握 Markdown 深度集成，在 Vue3 组件中优雅嵌入所见即所得编辑器，并对大量 Markdown 内容的渲染性能进行专项调优，最终实现了极低延迟的富文本呈现体验。'
  },
  {
    id: 2, name: 'ECharts Artist', icon: '📊', level: 'Silver',
    desc: '解锁雷达图可视化技能。'
  },
  {
    id: 3, name: 'Worker Pioneer', icon: '⚙️', level: 'Gold',
    desc: '精通 Web Worker 多线程，将密集型计算任务从主线程剥离至独立 Worker，结合 Event Loop 宏任务调度，有效消除了长任务对 UI 交互的帧率阻塞，保障了海量数据场景下页面稳定 60fps 的丝滑响应。'
  },
  {
    id: 4, name: 'Glass Architect', icon: '✨', level: 'Silver',
    desc: '深刻理解玻璃拟物渲染，严格约束 transform 与 opacity 属性以建立 GPU 合成层，从底层规避大量重排与重绘。'
  },
  {
    id: 5, name: 'Router Guardian', icon: '🔒', level: 'Bronze',
    desc: '攻克 SPA 动态路由就地复用引发的状态污染漏洞，联动 Vue Router 全局守卫与 Pinia 缓存池进行强制状态重置，从路由级别斩断了跨页面切换时的数据碰撞隐患。'
  },
  {
    id: 6, name: 'Grid Weaver', icon: '💎', level: 'Gold',
    desc: '手写 CSS 瀑布流。'
  }
])

const growthTracks = ref([
  { id: 1, stage: '核心引擎搭建', detail: '基于 Vite + Vue3 完成工程化地基，跑通 Pinia 状态流', date: '2025.10' },
  { id: 2, stage: '高级组件封装', detail: '自主实现 GeekToast 全局通知与骨架屏扫光特效', date: '2025.11' },
  { id: 3, stage: '数据维度交互', detail: '攻克路由 ID 冲突，完成收藏夹数据链路全线打通', date: '2025.12' },
  { id: 4, stage: '极致性能调优', detail: '引入 Web Worker 异步计算，主线程负载降低 80%', date: '2026.01' }
])

// ============= 热力图 (GitHub style heatmap) - 通过 Web Worker 异步处理 =============
const heatmapDays = ref([])
const generateHeatmapViaWorker = () => {
  // 使用 Vite 特有语法引入 Web Worker
  worker = new Worker(new URL('@/workers/dataProcessor.worker.js', import.meta.url), {
    type: 'module'
  })

  // 监听返回的消息
  worker.onmessage = (e) => {
    const { action, data } = e.data
    if (action === 'HEATMAP_READY') {
      heatmapDays.value = data
      console.log('✅ 收到来自 Web Worker 的独立计算结果')
    }
  }

  // 向 Worker 发送任务，要求计算 364 天的热力数据
  worker.postMessage({
    action: 'GENERATE_HEATMAP',
    payload: { daysCount: 364 }
  })
}


</script>

<template>
  <div class="profile-container">

    <!-- 顶部核心版块：极客档案卡 -->
    <div class="profile-header modern-panel">
      <!-- 极光背景点缀 -->
      <div class="panel-glow"></div>

      <div class="user-info-section">
        <div class="avatar-box">
          <div class="avatar-ring"></div>
          <img :src="userInfo.avatar" alt="Avatar" class="avatar-img" />
        </div>

        <div class="info-details">
          <h1 class="user-name">{{ userInfo.name }}</h1>
          <p class="user-role">{{ userInfo.role }}</p>
          <p class="user-bio">{{ userInfo.bio }}</p>

          <div class="user-stats">
            <div class="stat-item"><span class="stat-num">{{ userInfo.likes }}</span> <span class="stat-label">获赞</span></div>
            <div class="stat-item"><span class="stat-num">{{ userInfo.followers }}</span> <span class="stat-label">粉丝</span></div>
            <div class="stat-item"><span class="stat-num">{{ userInfo.following }}</span> <span class="stat-label">关注</span></div>
          </div>
        </div>
      </div>

      <!-- 技术脉搏看板 (Bento Grid 替换雷达图) -->
      <div class="technical-dashboard">
        <div class="dashboard-grid">
          <!-- 战力概览卡 -->
          <div class="bento-card main-stat">
            <h4 class="bento-title">综合评分 // PERFORMANCE</h4>
            <div class="power-display">
              <span class="power-value">91</span>
              <span class="power-unit">RANK.S</span>
            </div>
            <div class="power-progress-bg">
              <div class="power-progress-fill" style="width: 91%"></div>
            </div>
          </div>

          <!-- 核心能力列表 -->
          <div class="bento-card skills-list">
            <div v-for="m in geekMetrics" :key="m.label" class="metric-row">
              <span class="metric-label">{{ m.label }}</span>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: m.value + '%', backgroundColor: m.color }"></div>
              </div>
              <span class="metric-value">{{ m.value }}%</span>
            </div>
          </div>
          
          <!-- 工程化成熟度 (占据剩余空间) -->
          <div class="bento-card mini-card engineering-stat">
            <div class="mini-label">工程化成熟度 // INFRA_STABILITY</div>
            <div class="mini-value">98.2%</div>
            <div class="mini-progress-bg">
              <div class="mini-progress-fill" style="width: 98.2%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中部版块：3D悬浮技术标签云 -->
    <div class="tech-stack modern-panel">
      <h3 class="section-title">技术栈域图 // TECH_STACK</h3>
      <div class="floating-tags-cloud">
        <div
          class="float-tag"
          v-for="(tag, index) in stackTags"
          :key="tag"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="tag-glow"></div>
          <span class="tag-text">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 活跃度热力图面板 -->
    <div class="heatmap-section modern-panel">
      <h3 class="section-title">活跃矩阵 // ACTIVITY_MATRIX</h3>
      <div class="heatmap-container">
        <div class="heatmap-scroll">
          <div class="heatmap-grid">
            <div
              v-for="day in heatmapDays"
              :key="day.id"
              class="heatmap-cell"
              :data-level="day.level"
              :title="`活跃度: Level ${day.level}`"
            ></div>
          </div>
        </div>
        <div class="heatmap-legend">
          <span>Less</span>
          <div class="heatmap-cell" data-level="0"></div>
          <div class="heatmap-cell" data-level="1"></div>
          <div class="heatmap-cell" data-level="2"></div>
          <div class="heatmap-cell" data-level="3"></div>
          <div class="heatmap-cell" data-level="4"></div>
          <span>More</span>
        </div>
      </div>
    </div>

    <!-- 底部版块：动态交互历史流 -->
    <div class="activity-section modern-panel">
      <div class="tab-header">
        <button
          class="geek-tab"
          :class="{ 'is-active': activeTab === 'posts' }"
          @click="activeTab = 'posts'"
        >
          获得勋章 // HONORS ({{ honors.length }})
        </button>
        <button
          class="geek-tab"
          :class="{ 'is-active': activeTab === 'joined' }"
          @click="activeTab = 'joined'"
        >
          开发记录 // PROGRESS ({{ growthTracks.length }})
        </button>
      </div>

      <div class="tab-body">
        <transition name="list-fade" mode="out-in">
          <!-- 勋章墙 -->
          <div v-if="activeTab === 'posts'" class="honors-grid" key="honors">
            <div v-for="honor in honors" :key="honor.id" class="honor-card">
              <div class="honor-icon">{{ honor.icon }}</div>
              <div class="honor-info">
                <h4 class="honor-name">{{ honor.name }}</h4>
                <p class="honor-desc">{{ honor.desc }}</p>
              </div>
              <div class="honor-level" :class="'level-' + honor.level">{{ honor.level }}</div>
            </div>
          </div>
          
          <!-- 成长时间轴 -->
          <div v-else class="growth-timeline" key="growth">
            <div v-for="track in growthTracks" :key="track.id" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-stage">{{ track.stage }}</span>
                  <span class="timeline-date">{{ track.date }}</span>
                </div>
                <p class="timeline-detail">{{ track.detail }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1040px;
  margin: 24px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modern-panel {
  position: relative;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px -10px var(--color-shadow);
  /* 移除 overflow:hidden，防止技能环和内容被裁剪 */
}

.panel-glow {
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
  pointer-events: none;
  z-index: -1;
}

[data-theme='dark'] .panel-glow {
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
  mix-blend-mode: screen;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-fg-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 8px; height: 8px;
  background: var(--color-accent-fg);
  border-radius: 2px;
  box-shadow: 0 0 10px var(--color-accent-fg);
}

/* 顶部配置：改为垂直堆叠，防止技能环过小被 clip */
.profile-header {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.user-info-section {
  display: flex;
  gap: 32px;
  align-items: center;
  padding-bottom: 32px;
  border-bottom: 1px dashed var(--color-border-muted);
}

.avatar-box {
  position: relative;
  width: 120px; height: 120px;
  flex-shrink: 0;
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px dashed var(--color-border-default);
  animation: slow-spin 20s linear infinite;
}

@keyframes slow-spin {
  to { transform: rotate(360deg); }
}

.avatar-img {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 4px solid var(--color-canvas-default);
  background: var(--color-canvas-subtle);
  object-fit: cover;
  box-shadow: 0 10px 20px -5px var(--color-shadow);
}

.info-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--color-fg-default);
  margin: 0 0 4px 0;
  background: linear-gradient(to right, var(--color-fg-default), var(--color-fg-muted));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-role {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 14px;
  color: var(--color-accent-fg);
  margin: 0 0 16px 0;
  font-weight: 600;
}

.terminal-prompt { color: var(--color-success-fg); }
.cursor-blink { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

.user-bio {
  font-size: 15px;
  color: var(--color-fg-muted);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.user-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.stat-num {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-fg-default);
  font-family: 'Fira Code', monospace;
}

.stat-label {
  font-size: 13px;
  color: var(--color-fg-subtle);
}

/* 技术脉搏看板 (Bento Grid) */
.technical-dashboard {
  flex: 1;
  min-height: 220px;
}

.bento-card {
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-fg);
  box-shadow: 0 12px 24px -10px var(--color-shadow);
  background: var(--color-canvas-default);
}

.main-stat {
  grid-area: main;
  background: linear-gradient(135deg, rgba(9, 105, 218, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(9, 105, 218, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(10px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "main skills"
    "main infra";
  gap: 16px;
  height: 100%;
}

.skills-list { grid-area: skills; }
.engineering-stat { 
  grid-area: infra;
  justify-content: space-between !important;
}

.bento-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-fg-muted);
  margin: 0;
}

.power-display {
  margin: 12px 0;
}

.power-value {
  font-size: 56px;
  font-weight: 800;
  color: var(--color-accent-fg);
  font-family: 'Fira Code', monospace;
  line-height: 1;
  text-shadow: 0 0 20px rgba(9, 105, 218, 0.2);
}

.power-unit {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-fg-subtle);
  margin-left: 8px;
}

.power-progress-bg {
  height: 4px;
  background: var(--color-border-muted);
  border-radius: 2px;
  overflow: hidden;
}

.power-progress-fill {
  height: 100%;
  background: var(--color-accent-fg);
  box-shadow: 0 0 10px var(--color-accent-fg);
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.metric-row:last-child { margin-bottom: 0; }

.metric-label { font-size: 12px; font-weight: 600; width: 60px; color: var(--color-fg-muted); }

.metric-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border-muted);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease-out;
}

.metric-value {
  font-size: 11px;
  font-family: 'Fira Code', monospace;
  color: var(--color-fg-subtle);
  width: 30px;
  text-align: right;
}

.mini-card {
  padding: 16px;
}

.mini-label { 
  font-size: 11px; 
  font-weight: 700;
  color: var(--color-fg-subtle);
  letter-spacing: 1px;
}
.mini-value { 
  font-size: 24px; 
  font-weight: 800; 
  color: var(--color-fg-default); 
  font-family: 'Fira Code', monospace; 
  margin: 8px 0;
}

.mini-progress-bg {
  height: 2px;
  background: var(--color-border-muted);
  border-radius: 1px;
  overflow: hidden;
  width: 100%;
}

.mini-progress-fill {
  height: 100%;
  background: var(--color-success-fg);
  box-shadow: 0 0 8px var(--color-success-fg);
}

/* 3D悬浮标签云 */
.floating-tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 0;
}

.float-tag {
  position: relative;
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-muted);
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-fg-muted);
  cursor: default;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: float-up 0.5s ease-out backwards;
}

@keyframes float-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.tag-glow {
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--color-accent-fg), #ec4899);
  border-radius: 12px;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s;
  filter: blur(8px);
}

.float-tag:hover {
  transform: translateY(-8px) scale(1.05);
  color: var(--color-fg-default);
  background: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
  z-index: 10;
}

.float-tag:hover .tag-glow {
  opacity: 0.4;
}
[data-theme='dark'] .float-tag:hover .tag-glow {
  opacity: 0.6;
}

/* 活跃度热力图 */
.heatmap-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.heatmap-scroll {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
}

/* 隐藏滚动条但保留功能 */
.heatmap-scroll::-webkit-scrollbar { height: 4px; }
.heatmap-scroll::-webkit-scrollbar-thumb { background: var(--color-border-default); border-radius: 4px; }

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 4px;
}

.heatmap-cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: var(--color-canvas-subtle);
  border: 1px solid rgba(27, 31, 36, 0.04);
  transition: transform 0.1s;
}

.heatmap-cell:hover {
  transform: scale(1.4);
  border-color: var(--color-border-muted);
  z-index: 10;
}

[data-theme='dark'] .heatmap-cell { border-color: rgba(255, 255, 255, 0.05); }

/* 极客品牌色热力等级 */
.heatmap-cell[data-level="1"] { background-color: rgba(9, 105, 218, 0.3); }
.heatmap-cell[data-level="2"] { background-color: rgba(9, 105, 218, 0.55); }
.heatmap-cell[data-level="3"] { background-color: rgba(9, 105, 218, 0.8); }
.heatmap-cell[data-level="4"] { background-color: rgba(9, 105, 218, 1); }

[data-theme='dark'] .heatmap-cell[data-level="1"] { background-color: rgba(47, 129, 247, 0.3); }
[data-theme='dark'] .heatmap-cell[data-level="2"] { background-color: rgba(47, 129, 247, 0.55); }
[data-theme='dark'] .heatmap-cell[data-level="3"] { background-color: rgba(47, 129, 247, 0.8); }
[data-theme='dark'] .heatmap-cell[data-level="4"] { background-color: rgba(47, 129, 247, 1); }

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 12px;
  color: var(--color-fg-muted);
}

.heatmap-legend span {
  margin: 0 4px;
}

/* 极客风 Tab 切换 */
.tab-header {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-border-subtle);
}

.geek-tab {
  background: transparent;
  border: none;
  padding: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-fg-muted);
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
  margin-right: 24px;
}

.geek-tab.is-active {
  color: var(--color-accent-fg);
}

.geek-tab::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 2px;
  background: var(--color-accent-fg);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px var(--color-accent-fg);
}

.geek-tab.is-active::after {
  transform: scaleX(1);
}

/* 勋章墙 - 纯 CSS 瀑布流
 * 原理：column-count 将容器切成 N 条竖向泳道，卡片从上到下依次填充最短的列
 * 优势：布局计算完全在浏览器渲染引擎内完成，零 JS 介入，彻底规避重排重绘
 * 与 Grid 区别：Grid 强制对齐行高（整齐），columns 允许每列独立伸缩（错落有致）
 */
.honors-grid {
  column-count: 3;
  column-gap: 20px;
}

@media (max-width: 860px) {
  .honors-grid { column-count: 2; }
}
@media (max-width: 520px) {
  .honors-grid { column-count: 1; }
}

.honor-card {
  position: relative;
  padding: 24px;
  background: linear-gradient(135deg, var(--color-canvas-subtle) 0%, transparent 100%);
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  display: flex;
  align-items: flex-start;      /* 顶对齐：高度由内容自然撑开，是瀑布流错落感的来源 */
  gap: 20px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  overflow: hidden;
  break-inside: avoid;          /* 核心：禁止卡片在分列处被截断成两半 */
  margin-bottom: 20px;          /* column-count 不支持 row-gap，用 margin 代替 */
}

.honor-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
  box-shadow: 0 20px 40px -15px var(--color-shadow);
}

.honor-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  background: var(--color-accent-fg);
  opacity: 0;
  transition: opacity 0.3s;
}

.honor-card:hover::before {
  opacity: 1;
}

.honor-icon {
  font-size: 32px;
}

.honor-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--color-fg-default);
}

.honor-desc {
  font-size: 13px;
  color: var(--color-fg-muted);
  margin: 0;
}

.honor-level {
  position: absolute;
  top: 10px; right: -25px;
  transform: rotate(45deg);
  font-size: 10px;
  font-weight: 800;
  padding: 2px 30px;
  text-transform: uppercase;
}
.level-Gold { background: #fef9c3; color: #854d0e; }
.level-Silver { background: #f1f5f9; color: #475569; }
.level-Bronze { background: #ffedd5; color: #9a3412; }

/* 成长时间轴 */
.growth-timeline {
  padding: 20px 0 20px 20px;
  border-left: 2px dashed var(--color-border-muted);
  margin-left: 10px;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-item:last-child { margin-bottom: 0; }

.timeline-marker {
  position: absolute;
  left: -27px;
  top: 6px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--color-accent-fg);
  border: 4px solid var(--color-canvas-default);
  box-shadow: 0 0 10px var(--color-accent-fg);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-stage {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-fg-default);
}

.timeline-date {
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: var(--color-accent-fg);
  background: var(--color-accent-subtle);
  padding: 2px 8px;
  border-radius: 4px;
}

.timeline-detail {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-fg-muted);
  margin: 0;
}


/* 移动端适配 */
@media screen and (max-width: 900px) {
  .profile-header { flex-direction: column; gap: 40px; }
  .user-info-section { border-right: none; border-bottom: 1px dashed var(--color-border-muted); padding-right: 0; padding-bottom: 40px; }
  .skill-rings-container { justify-content: center; }
}

@media screen and (max-width: 768px) {
  .modern-panel { padding: 24px; }
  .user-info-section { flex-direction: column; align-items: center; text-align: center; }
  .user-stats { justify-content: center; }
  .tab-header { justify-content: center; }
  .geek-tab { margin: 0 12px; }
  .activity-item { flex-direction: column; align-items: flex-start; gap: 12px; }
  .item-date { align-self: flex-start; margin-left: 28px;}
}
</style>
