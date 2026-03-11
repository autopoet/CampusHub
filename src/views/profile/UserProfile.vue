<script setup>
import { ref } from 'vue'

const userInfo = ref({
  name: '前端小牛',
  role: '前端架构师 / 独立极客',
  bio: '保持对技术的热爱，持续探索 Web 渲染边界与次世代交互设计。',
  followers: 128,
  following: 56,
  likes: 1024
})

const skills = ref([
  { name: 'Vue 3 / 生态', power: 92, color: '#42b883' },
  { name: 'JavaScript', power: 88, color: '#f7df1e' },
  { name: 'CSS / 动效引擎', power: 85, color: '#38bdf8' },
  { name: 'Node.js', power: 75, color: '#4ade80' }
])

const stackTags = ['Vue3', 'Pinia', 'Vite', 'Element Plus', 'WebGL', 'Three.js', 'Git', 'Webpack', 'Figma', 'TypeScript']

const activeTab = ref('posts')

const myPosts = ref([
  {
    id: 1,
    title: '蓝桥杯 Web 应用开发国赛组队，缺一后端！',
    status: '招募中',
    date: '2小时前'
  },
  {
    id: 2,
    title: '寻找 UI 设计师一起打磨大创项目',
    status: '已满员',
    date: '3天前'
  }
])

const myJoined = ref([
  {
    id: 3,
    title: '计算机设计大赛 - “校园跑腿极速版”队伍',
    role: '核心前端开发',
    date: '2025-10-12'
  }
])

// ============= 热力图 (GitHub style heatmap) =============
const heatmapDays = ref([])
const generateHeatmap = () => {
  const days = []
  // 生成过去一年的假数据 (52 周 * 7 天 = 364)
  for(let i = 0; i < 364; i++) {
    // 随机活跃等级 0-4
    const level = Math.random() > 0.65 ? Math.floor(Math.random() * 4) + 1 : 0
    days.push({ id: i, level })
  }
  heatmapDays.value = days
}
generateHeatmap()
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
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=牛" alt="Avatar" class="avatar-img" />
        </div>
        
        <div class="info-details">
          <h1 class="user-name">{{ userInfo.name }}</h1>
          <p class="user-role"><span class="terminal-prompt">></span> {{ userInfo.role }} <span class="cursor-blink">_</span></p>
          <p class="user-bio">{{ userInfo.bio }}</p>
          
          <div class="user-stats">
            <div class="stat-item"><span class="stat-num">{{ userInfo.likes }}</span> <span class="stat-label">获赞</span></div>
            <div class="stat-item"><span class="stat-num">{{ userInfo.followers }}</span> <span class="stat-label">粉丝</span></div>
            <div class="stat-item"><span class="stat-num">{{ userInfo.following }}</span> <span class="stat-label">关注</span></div>
          </div>
        </div>
      </div>
      
      <!-- 原生 CSS 可视化能力环 -->
      <div class="skill-matrix-section">
        <h3 class="section-title">核心战力雷达 // SKILL_MATRIX</h3>
        <div class="skill-rings-container">
          <div class="skill-ring-wrapper" v-for="skill in skills" :key="skill.name">
            <!-- 纯 CSS conic-gradient 圆环进度 -->
            <div 
              class="css-ring" 
              :style="{ 
                background: `conic-gradient(${skill.color} ${skill.power}%, var(--color-border-default) 0)`
              }"
            >
              <div class="ring-inner">
                <span class="ring-value" :style="{ color: skill.color }">{{ skill.power }}<small>%</small></span>
              </div>
            </div>
            <span class="skill-name">{{ skill.name }}</span>
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
          发起的集结 ({{ myPosts.length }})
        </button>
        <button 
          class="geek-tab" 
          :class="{ 'is-active': activeTab === 'joined' }"
          @click="activeTab = 'joined'"
        >
          我的编队 ({{ myJoined.length }})
        </button>
      </div>

      <div class="tab-body">
        <transition name="list-fade" mode="out-in">
          <!-- 发布的帖子 -->
          <TransitionGroup 
            v-if="activeTab === 'posts'" 
            name="stagger-list" 
            tag="ul" 
            class="activity-list" 
            key="posts"
          >
            <li v-for="post in myPosts" :key="post.id" class="activity-item hover-effect">
              <div class="item-left">
                <div class="status-indicator" :class="post.status === '招募中' ? 'status-green' : 'status-gray'">
                  <div class="ping" v-if="post.status === '招募中'"></div>
                </div>
                <span class="status-text">{{ post.status }}</span>
                <span class="post-title">{{ post.title }}</span>
              </div>
              <span class="item-date">{{ post.date }}</span>
            </li>
            <div v-if="myPosts.length === 0" class="empty-state" key="empty-post">
              <div class="empty-icon"></div>
              <p>暂无发起的组队信号</p>
            </div>
          </TransitionGroup>
          
          <!-- 参与的队伍 -->
          <TransitionGroup 
            v-else 
            name="stagger-list" 
            tag="ul" 
            class="activity-list" 
            key="joined"
          >
            <li v-for="team in myJoined" :key="team.id" class="activity-item hover-effect">
              <div class="item-left">
                <span class="role-badge">{{ team.role }}</span>
                <span class="post-title">{{ team.title }}</span>
              </div>
              <span class="item-date">{{ team.date }}</span>
            </li>
            <div v-if="myJoined.length === 0" class="empty-state" key="empty-join">
               <div class="empty-icon"></div>
               <p>您尚未加入任何阵列</p>
            </div>
          </TransitionGroup>
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
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--color-fg-default);
  margin: 0 0 8px 0;
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

/* 原生 CSS 甜甜圈图表 */
.skill-matrix-section {
  width: 100%;
}

.skill-rings-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 24px;
  align-items: start;
}

.skill-ring-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.css-ring {
  position: relative;
  width: 76px; height: 76px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  animation: ring-grow 1s ease-out forwards;
}

@keyframes ring-grow {
  from { transform: scale(0.8) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.ring-inner {
  position: absolute;
  inset: 8px; /* 这个决定了圆环的粗细 */
  background: var(--color-canvas-default);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.ring-value {
  font-family: 'Fira Code', monospace;
  font-weight: 800;
  font-size: 18px;
  display: flex; align-items: baseline;
}
.ring-value small { font-size: 10px; font-weight: 600; margin-left: 2px;}

.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-muted);
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

/* 动态列表 */
.activity-list {
  list-style: none;
  padding: 0; margin: 0;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-canvas-subtle);
  border: 1px solid transparent;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.activity-item.hover-effect:hover {
  background: var(--color-btn-hover-bg);
  border-color: var(--color-border-default);
  transform: translateX(4px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-indicator {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 12px; height: 12px;
}
.status-green { background: #22c55e; border-radius: 50%; }
.status-green .ping {
  position: absolute; width: 100%; height: 100%;
  background: #22c55e; border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
.status-gray { background: var(--color-border-default); width: 8px; height: 8px; border-radius: 50%; }

@keyframes ping {
  75%, 100% { transform: scale(2.5); opacity: 0; }
}

.status-text { font-size: 12px; font-weight: 600; color: var(--color-fg-muted); }
.post-title { font-size: 15px; font-weight: 600; color: var(--color-fg-default); }

.role-badge {
  font-size: 11px; font-weight: 600; color: var(--color-accent-fg);
  border: 1px solid rgba(9, 105, 218, 0.3);
  background: rgba(9, 105, 218, 0.05);
  padding: 2px 8px; border-radius: 12px;
}
[data-theme='dark'] .role-badge { border-color: rgba(47, 129, 247, 0.4); }

.item-date { font-size: 13px; color: var(--color-fg-muted); font-family: 'Fira Code', monospace;}

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 0; color: var(--color-fg-subtle);
}

/* 列表进入/离开动画 */
.list-fade-enter-active, .list-fade-leave-active { transition: opacity 0.3s; }
.list-fade-enter-from, .list-fade-leave-to { opacity: 0; }

.stagger-list-move, .stagger-list-enter-active, .stagger-list-leave-active { transition: all 0.4s ease; }
.stagger-list-enter-from { opacity: 0; transform: translateX(-30px); }
.stagger-list-leave-to { opacity: 0; transform: translateX(30px); }
.stagger-list-leave-active { position: absolute; }


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
