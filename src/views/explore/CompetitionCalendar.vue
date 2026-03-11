<script setup>
import { computed, ref, inject } from "vue"

const openPublishModal = inject("openPublishModal")

const selectedLevel = ref("all")

const rawCompetitions = [
  {
    id: 1,
    name: "第十五届蓝桥杯全国软件和信息技术专业人才大赛",
    level: "国家级",
    levelColor: "#3b82f6",
    deadline: "2026-04-15",
    desc: "工信部人才交流中心举办，全国规模最大的IT类学科竞赛。包含C/C++、Java、Python算法赛道及Web、软件测试等开发赛道。保研加分利器，大厂绿卡。",
    tags: ["算法", "Web开发", "保研加分"],
    reward: "国一 ¥10,000",
    teamSize: "个人赛 / 1-3人",
    organizer: "工信部人才交流中心"
  },
  {
    id: 2,
    name: "2026 年中国大学生计算机设计大赛",
    level: "国家级",
    levelColor: "#ec4899",
    deadline: "2026-05-10",
    desc: "中国高等教育学会主办的A类赛事。项目涵盖软件应用开发、微课、数字媒体、人工智能应用等。侧重于项目的完整度和现场PPT答辩呈现能力。",
    tags: ["软件开发", "人工智能", "数字媒体"],
    reward: "校级支持金",
    teamSize: "1-3人",
    organizer: "中国大学生计算机设计大赛组委会"
  },
  {
    id: 3,
    name: "“挑战杯”全国大学生课外学术科技作品竞赛",
    level: "挑战杯",
    levelColor: "#eab308",
    deadline: "2026-03-20",
    desc: "中国大学生三大顶流科技赛事之一，被誉为大学生科技创新“奥林匹克”。涵盖自然科学、哲学社会科学、科技发明制作等三大类，创业/保研极高权重。",
    tags: ["学术作品", "科技发明", "最高权重"],
    reward: "保研直通车",
    teamSize: "1-8人",
    organizer: "共青团中央、中国科协、教育部"
  },
  {
    id: 4,
    name: "微信小程序应用开发赛",
    level: "省市级",
    levelColor: "#10b981",
    deadline: "2026-03-01",
    desc: "由腾讯微信团队与清华大学联合主办，鼓励基于微信生态开发创新性的小程序，包括云开发、小游戏等。获奖者直接对接微信实习通道。",
    tags: ["微信生态", "敏捷开发", "前端"],
    reward: "¥8,000",
    teamSize: "2-4人",
    organizer: "腾讯微信"
  },
  {
    id: 5,
    name: "华为ICT大赛（云赛道）",
    level: "国家级",
    levelColor: "#f59e0b",
    deadline: "2026-06-30",
    desc: "华为主办，云计算/AI/大数据三大赛道，获奖者有机会直推华为实习名额，含金量无需多言。",
    tags: ["云计算", "AI", "华为生态"],
    reward: "¥30,000",
    teamSize: "1-3人",
    organizer: "华为技术有限公司"
  }
]

const competitions = computed(() => {
  const today = Date.now()
  return rawCompetitions
    .map(comp => {
      const targetDate = new Date(comp.deadline).getTime()
      const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
      const isExpired = diffDays < 0
      const urgency = !isExpired && diffDays <= 14 ? "urgent" : (!isExpired && diffDays <= 30 ? "soon" : "normal")
      return { ...comp, diffDays: diffDays > 0 ? diffDays : 0, isExpired, urgency }
    })
    .filter(c => selectedLevel.value === "all" || c.level === selectedLevel.value)
})

const stats = computed(() => ({
  total: rawCompetitions.length,
  active: rawCompetitions.filter(c => new Date(c.deadline).getTime() > Date.now()).length,
  national: rawCompetitions.filter(c => c.level === "国家级").length,
  urgent: rawCompetitions.filter(c => {
    const d = Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 864e5)
    return d > 0 && d <= 14
  }).length
}))

const goToRecruit = () => {
  openPublishModal("recruit")
}
</script>

<template>
  <div class="explore-page">

    <!-- 顶部 Hero -->
    <div class="page-hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="page-eyebrow">
            <span class="eyebrow-dot"></span>
            <span>赛事季 · 2026 春季</span>
          </div>
          <h1 class="page-title">竞赛大厅</h1>
          <p class="page-sub">把握每一个技术舞台，找到你的极客战友</p>
        </div>

        <!-- 实时数据看板 -->
        <div class="stats-board">
          <div class="stat-block">
            <span class="stat-num">{{ stats.total }}</span>
            <span class="stat-label">赛事总数</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-block">
            <span class="stat-num text-green">{{ stats.active }}</span>
            <span class="stat-label">正在报名</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-block">
            <span class="stat-num text-gold">{{ stats.national }}</span>
            <span class="stat-label">国家级</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-block">
            <span class="stat-num text-red">{{ stats.urgent }}</span>
            <span class="stat-label">即将截止</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-inner">
        <button
          v-for="opt in [{ val:'all', label:'全部赛事' }, { val:'国家级', label:'国家级' }, { val:'省级', label:'省级' }]"
          :key="opt.val"
          class="filter-btn"
          :class="{ active: selectedLevel === opt.val }"
          @click="selectedLevel = opt.val"
        >
          {{ opt.label }}
        </button>
        <span class="filter-count">共 {{ competitions.length }} 场</span>
      </div>
    </div>

    <!-- 时间线内容区 -->
    <div class="timeline-wrapper">
      <div class="timeline-line"></div>

      <div
        class="timeline-item"
        v-for="(item, idx) in competitions"
        :key="item.id"
        :style="{ animationDelay: idx * 0.1 + 's' }"
      >
        <!-- 时间节点 -->
        <div class="node-dot" :class="{ 'dot-expired': item.isExpired, 'dot-urgent': item.urgency === 'urgent' }">
          <div class="dot-ring" v-if="!item.isExpired && item.urgency === 'urgent'"></div>
        </div>

        <!-- 内容 -->
        <div class="item-content">
          <!-- 头部信息 -->
          <div class="item-meta">
            <time class="deadline-text">截止 {{ item.deadline }}</time>
            <span v-if="!item.isExpired && item.urgency === 'urgent'" class="badge badge-red">
              ⚡ 仅剩 {{ item.diffDays }} 天
            </span>
            <span v-else-if="!item.isExpired && item.urgency === 'soon'" class="badge badge-orange">
              剩 {{ item.diffDays }} 天
            </span>
            <span v-else-if="!item.isExpired" class="badge badge-blue">
              倒计时 {{ item.diffDays }} 天
            </span>
            <span v-else class="badge badge-gray">已截止</span>
          </div>

          <!-- 赛事卡片 -->
          <div class="comp-card" :class="{ 'card-expired': item.isExpired }">
            <!-- 卡片左侧彩条 -->
            <div class="card-stripe" :style="{ background: item.isExpired ? 'var(--color-border-default)' : item.levelColor }"></div>

            <div class="card-body">
              <!-- 标题区 -->
              <div class="comp-header">
                <div class="comp-title-row">
                  <span class="level-chip" :style="{ color: item.isExpired ? 'var(--color-fg-subtle)' : item.levelColor, borderColor: item.isExpired ? 'var(--color-border-default)' : item.levelColor + '40' }">
                    {{ item.level }}
                  </span>
                  <h2 class="comp-name">{{ item.name }}</h2>
                </div>
                <div class="comp-organizer">主办方：{{ item.organizer }}</div>
              </div>

              <p class="comp-desc">{{ item.desc }}</p>

              <!-- 标签 -->
              <div class="comp-tags">
                <span class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
              </div>

              <!-- 底部：奖励信息 + 操作按钮 -->
              <div class="comp-footer">
                <div class="comp-meta-chips">
                  <div class="meta-chip">
                    <svg viewBox="0 0 24 24" class="chip-icon"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                    {{ item.reward }}
                  </div>
                  <div class="meta-chip">
                    <svg viewBox="0 0 24 24" class="chip-icon"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    {{ item.teamSize }}
                  </div>
                </div>

                <button
                  class="recruit-btn"
                  :class="item.isExpired ? 'btn-off' : 'btn-on'"
                  :disabled="item.isExpired"
                  @click="goToRecruit(item.name)"
                >
                  <template v-if="!item.isExpired">
                    <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    发起招募
                  </template>
                  <template v-else>通道关闭</template>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================================
   Page Hero
   ================================ */
.explore-page {
  min-height: 100vh;
}

.page-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%);
  padding: 40px 0 44px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
  position: relative;
}

.page-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(139, 92, 246, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.07) 1px, transparent 1px);
  background-size: 48px 48px;
}

.hero-inner {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.page-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.35);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #c4b5fd;
  margin-bottom: 16px;
}

.eyebrow-dot {
  width: 6px; height: 6px;
  background: #a78bfa;
  border-radius: 50%;
  animation: blink-dot 2s ease infinite;
}
@keyframes blink-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.page-title {
  font-size: 40px;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.page-sub {
  font-size: 15px;
  color: #94a3b8;
}

/* Data Board */
.stats-board {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px 28px;
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px;
  gap: 6px;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: #f1f5f9;
  font-family: 'Fira Code', monospace;
  line-height: 1;
}

.text-green { color: #4ade80; }
.text-gold { color: #fbbf24; }
.text-red { color: #f87171; }

.stat-label {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.1);
}

/* ================================
   Filter Bar
   ================================ */
.filter-bar {
  background: var(--color-canvas-default);
  border-bottom: 1px solid var(--color-border-default);
  position: sticky;
  top: 60px;
  z-index: 10;
}

.filter-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 48px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-fg-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: var(--color-canvas-subtle);
  color: var(--color-fg-default);
}

.filter-btn.active {
  background: var(--color-accent-subtle);
  color: var(--color-accent-fg);
  border-color: rgba(9, 105, 218, 0.2);
}

.filter-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--color-fg-subtle);
}

/* ================================
   Timeline
   ================================ */
.timeline-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 44px;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-accent-fg), var(--color-border-default) 80%);
  opacity: 0.3;
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 20px;
  margin-bottom: 36px;
  animation: slideInItem 0.5s ease both;
}

@keyframes slideInItem {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Timeline dot */
.node-dot {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-accent-fg);
  border: 3px solid var(--color-canvas-default);
  box-shadow: 0 0 0 2px var(--color-accent-fg);
  margin-top: 30px;
  position: relative;
  z-index: 2;
}

.node-dot.dot-expired {
  background: var(--color-border-default);
  box-shadow: 0 0 0 2px var(--color-border-default);
}

.node-dot.dot-urgent {
  background: #ef4444;
  box-shadow: 0 0 0 2px #ef4444;
}

.dot-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #ef4444;
  animation: ring-pulse 1.5s ease-out infinite;
  opacity: 0;
}

@keyframes ring-pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}

/* Item content */
.item-content { flex: 1; min-width: 0; }

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.deadline-text {
  font-size: 13px;
  color: var(--color-fg-subtle);
  font-family: 'Fira Code', monospace;
}

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.badge-red   { background: #fef2f2; color: #dc2626; }
.badge-orange { background: #fff7ed; color: #ea580c; }
.badge-blue  { background: var(--color-accent-subtle); color: var(--color-accent-fg); }
.badge-gray  { background: var(--color-canvas-subtle); color: var(--color-fg-subtle); border: 1px solid var(--color-border-default);}

[data-theme='dark'] .badge-red   { background: rgba(220,38,38,0.15); color: #f87171; }
[data-theme='dark'] .badge-orange { background: rgba(234,88,12,0.15); color: #fb923c; }

/* ================================
   Competition Card
   ================================ */
.comp-card {
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.comp-card:hover:not(.card-expired) {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12);
  border-color: var(--color-accent-fg);
}

.card-expired {
  opacity: 0.55;
  filter: grayscale(60%);
  background: var(--color-canvas-subtle);
}

.card-stripe {
  width: 4px;
  flex-shrink: 0;
  transition: background 0.3s;
}

.card-body {
  flex: 1;
  padding: 24px;
  min-width: 0;
}

.comp-header { margin-bottom: 12px; }

.comp-title-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
}

.level-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 3px;
}

.comp-name {
  font-size: 19px;
  font-weight: 700;
  color: var(--color-fg-default);
  line-height: 1.4;
  margin: 0;
}

.comp-organizer {
  font-size: 12px;
  color: var(--color-fg-subtle);
}

.comp-desc {
  font-size: 14px;
  color: var(--color-fg-muted);
  line-height: 1.65;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent-fg);
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--color-accent-subtle);
  border: 1px solid rgba(9, 105, 218, 0.18);
}

[data-theme='dark'] .tag { border-color: rgba(47, 129, 247, 0.25); }
.card-expired .tag { color: var(--color-fg-subtle); background: transparent; border-color: var(--color-border-default); }

.comp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.comp-meta-chips {
  display: flex;
  gap: 12px;
}

.meta-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  padding: 6px 12px;
}

.chip-icon {
  width: 14px; height: 14px; flex-shrink: 0;
}

/* ================================
   Buttons
   ================================ */
.recruit-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-on {
  background: var(--color-accent-fg);
  color: #ffffff;
}

.btn-on:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(9,105,218,0.3);
}

.btn-icon { width: 15px; height: 15px; }

.btn-off {
  background: var(--color-btn-bg);
  color: var(--color-fg-subtle);
  border: 1px solid var(--color-border-default);
  cursor: not-allowed;
}

/* ================================
   Responsive
   ================================ */
@media screen and (max-width: 768px) {
  .hero-inner { flex-direction: column; align-items: flex-start; }
  .stats-board { width: 100%; justify-content: space-around; padding: 16px; }
  .stat-block { padding: 0 12px; }
  .page-title { font-size: 28px; }
  .timeline-line { left: 30px; }
  .timeline-wrapper { padding: 24px 16px 40px; }
  .node-dot { width: 16px; height: 16px; }
  .comp-name { font-size: 16px; }
  .comp-footer { flex-direction: column; align-items: flex-start; }
  .recruit-btn { width: 100%; justify-content: center; }
}
</style>
