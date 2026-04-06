<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMockStore } from '@/stores/mockStore'

const router = useRouter()
const store = useMockStore()

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

const activeTab = ref('recruit') // 默认招募

// 数据过滤：筛选作者为“前端小牛”的帖子
const myRecruitments = computed(() => {
  return store.recruitments.filter(item => item.author === userInfo.value.name)
})

const myShares = computed(() => {
  return store.shares.filter(item => item.author === userInfo.value.name)
})

// Web Worker 引用
let worker = null

onMounted(async () => {
  generateHeatmapViaWorker()
  
  // 确保数据已加载
  if (store.recruitments.length === 0) await store.loadRecruitments()
  if (store.shares.length === 0) await store.loadShares()
})

onUnmounted(() => {
  if (worker) worker.terminate()
})

const geekMetrics = computed(() => [
  ...skills.value.map(s => ({ label: s.name, value: s.power, color: s.color })),
  { label: '工程化', value: 94, color: 'var(--color-accent-fg)' }
])

const heatmapDays = ref([])
const generateHeatmapViaWorker = () => {
  worker = new Worker(new URL('@/workers/dataProcessor.worker.js', import.meta.url), {
    type: 'module'
  })
  worker.onmessage = (e) => {
    const { action, data } = e.data
    if (action === 'HEATMAP_READY') {
      heatmapDays.value = data
    }
  }
  worker.postMessage({
    action: 'GENERATE_HEATMAP',
    payload: { daysCount: 364 }
  })
}

const goToDetail = (item) => {
  router.push(`/home/detail/${item.type}/${item.id}`)
}
</script>

<template>
  <div class="profile-container">
    <!-- 顶部核心版块：极客档案卡 -->
    <div class="profile-header modern-panel">
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

      <div class="technical-dashboard">
        <div class="dashboard-grid">
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
          <div class="bento-card skills-list">
            <div v-for="m in geekMetrics" :key="m.label" class="metric-row">
              <span class="metric-label">{{ m.label }}</span>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: m.value + '%', backgroundColor: m.color }"></div>
              </div>
              <span class="metric-value">{{ m.value }}%</span>
            </div>
          </div>
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

    <!-- 技术栈标签 -->
    <div class="tech-stack modern-panel">
      <h3 class="section-title">技术栈域图 // TECH_STACK</h3>
      <div class="floating-tags-cloud">
        <div class="float-tag" v-for="(tag, index) in stackTags" :key="tag" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="tag-glow"></div>
          <span class="tag-text">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 热力图 -->
    <div class="heatmap-section modern-panel">
      <h3 class="section-title">活跃矩阵 // ACTIVITY_MATRIX</h3>
      <div class="heatmap-container">
        <div class="heatmap-scroll">
          <div class="heatmap-grid">
            <div v-for="day in heatmapDays" :key="day.id" class="heatmap-cell" :data-level="day.level" :title="`活跃度: Level ${day.level}`"></div>
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

    <!-- 底部板块：我的内容 -->
    <div class="content-section modern-panel">
      <div class="tab-header">
        <button class="geek-tab" :class="{ 'is-active': activeTab === 'recruit' }" @click="activeTab = 'recruit'">
          我的招募 // RECRUIT ({{ myRecruitments.length }})
        </button>
        <button class="geek-tab" :class="{ 'is-active': activeTab === 'share' }" @click="activeTab = 'share'">
          我的分享 // SHARES ({{ myShares.length }})
        </button>
      </div>

      <div class="tab-body">
        <transition name="list-fade" mode="out-in">
          <!-- 标题列表模式 -->
          <div v-if="activeTab === 'recruit'" class="post-list" key="recruit">
             <div v-if="myRecruitments.length === 0" class="empty-msg">暂时没有发布招募帖子</div>
             <div v-for="item in myRecruitments" :key="item.id" class="post-item" @click="goToDetail(item)">
                <div class="post-prefix"># {{ item.competition || '组队' }}</div>
                <div class="post-title">{{ item.title }}</div>
                <div class="post-meta">
                   <span class="status-tag" :class="{ 'is-active': item.status === '招募中' }">{{ item.status }}</span>
                   <span class="date">{{ item.updatedTime }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
             </div>
          </div>
          
          <div v-else class="post-list" key="share">
             <div v-if="myShares.length === 0" class="empty-msg">暂时没有发布分享文章</div>
             <div v-for="item in myShares" :key="item.id" class="post-item" @click="goToDetail(item)">
                <div class="post-prefix">📄 分享</div>
                <div class="post-title">{{ item.title }}</div>
                <div class="post-meta">
                   <span class="tag" v-for="t in (item.tags || []).slice(0, 2)" :key="t">{{ t }}</span>
                   <span class="date">{{ item.updatedTime }}</span>
                </div>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
             </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container { max-width: 1040px; margin: 24px auto; padding: 0 20px; display: flex; flex-direction: column; gap: 24px; }
.modern-panel { position: relative; background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 24px; padding: 32px; box-shadow: 0 4px 24px -10px var(--color-shadow); }
.panel-glow { position: absolute; inset: -50%; background: radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 60%); pointer-events: none; z-index: -1; }

.section-title { font-size: 14px; font-weight: 700; color: var(--color-fg-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; width: 8px; height: 8px; background: var(--color-accent-fg); border-radius: 2px; }

.profile-header { display: flex; flex-direction: column; gap: 32px; }
.user-info-section { display: flex; gap: 32px; align-items: center; padding-bottom: 32px; border-bottom: 1px dashed var(--color-border-muted); }
.avatar-box { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
.avatar-ring { position: absolute; inset: -6px; border-radius: 50%; border: 2px dashed var(--color-border-default); animation: spin 20s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 4px solid var(--color-canvas-default); object-fit: cover; }

.user-name { font-size: 36px; font-weight: 800; color: var(--color-fg-default); margin-bottom: 4px; }
.user-role { font-size: 14px; color: var(--color-accent-fg); font-weight: 600; margin-bottom: 16px; }
.user-bio { font-size: 15px; color: var(--color-fg-muted); line-height: 1.6; margin-bottom: 24px; }
.user-stats { display: flex; gap: 24px; }
.stat-item { display: flex; flex-direction: column; }
.stat-num { font-size: 20px; font-weight: 800; color: var(--color-fg-default); }
.stat-label { font-size: 12px; color: var(--color-fg-subtle); }

/* Bento Grid */
.dashboard-grid { display: grid; grid-template-columns: 1.2fr 1fr; grid-template-areas: "main skills" "main infra"; gap: 16px; }
.bento-card { background: var(--color-canvas-subtle); border: 1px solid var(--color-border-subtle); border-radius: 16px; padding: 20px; transition: 0.3s; }
.bento-card:hover { transform: translateY(-4px); border-color: var(--color-accent-fg); }
.main-stat { grid-area: main; background: linear-gradient(135deg, rgba(9,105,218,0.1), rgba(139,92,246,0.1)); }
.skills-list { grid-area: skills; }
.engineering-stat { grid-area: infra; display: flex; flex-direction: column; justify-content: space-between; }
.power-value { font-size: 48px; font-weight: 800; color: var(--color-accent-fg); }
.metric-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.metric-bar { flex: 1; height: 6px; background: var(--color-border-muted); border-radius: 3px; overflow: hidden; }
.metric-fill { height: 100%; border-radius: 3px; }

/* Content Section Tabs */
.tab-header { display: flex; gap: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--color-border-muted); }
.geek-tab { background: none; border: none; padding: 12px 0; font-size: 14px; font-weight: 700; color: var(--color-fg-muted); cursor: pointer; position: relative; }
.geek-tab.is-active { color: var(--color-accent-fg); }
.geek-tab.is-active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--color-accent-fg); box-shadow: 0 0 8px var(--color-accent-fg); }

/* Post List Mode */
.post-list { display: flex; flex-direction: column; gap: 12px; }
.post-item { 
  display: flex; align-items: center; gap: 16px; padding: 16px 20px; 
  background: var(--color-canvas-subtle); border-radius: 12px; 
  cursor: pointer; transition: 0.2s; position: relative;
}
.post-item:hover { background: var(--color-canvas-default); border: 1px solid var(--color-accent-fg); padding-left: 28px; }
.post-prefix { font-size: 12px; font-weight: 800; color: var(--color-accent-fg); opacity: 0.7; min-width: 80px; }
.post-title { font-size: 15px; font-weight: 600; color: var(--color-fg-default); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.post-meta { display: flex; align-items: center; gap: 12px; }
.status-tag { font-size: 11px; padding: 2px 8px; border-radius: 10px; background: var(--color-border-muted); color: var(--color-fg-subtle); }
.status-tag.is-active { background: rgba(45, 164, 78, 0.1); color: #2da44e; }
.tag { font-size: 11px; color: var(--color-accent-fg); background: var(--color-accent-subtle); padding: 2px 8px; border-radius: 4px; }
.date { font-size: 12px; color: var(--color-fg-subtle); }
.arrow-icon { color: var(--color-fg-subtle); font-size: 14px; }

.empty-msg { padding: 40px; text-align: center; color: var(--color-fg-subtle); font-style: italic; }

/* Other Sections */
.floating-tags-cloud { display: flex; flex-wrap: wrap; gap: 12px; }
.float-tag { padding: 8px 16px; background: var(--color-canvas-subtle); border-radius: 10px; font-size: 13px; font-weight: 600; }
.heatmap-grid { display: grid; grid-template-rows: repeat(7, 12px); grid-auto-flow: column; gap: 4px; }
.heatmap-cell { width: 12px; height: 12px; border-radius: 2px; background: var(--color-canvas-subtle); }
.heatmap-cell[data-level="1"] { background: rgba(9, 105, 218, 0.3); }
.heatmap-cell[data-level="4"] { background: rgba(9, 105, 218, 1); }
</style>
