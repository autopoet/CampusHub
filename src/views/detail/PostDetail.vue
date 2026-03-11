<script setup>
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 获取路由中的 ID
const postId = computed(() => route.params.id)

// 返回上一页
const goBack = () => {
  router.back()
}

// ============== 模拟数据 ==============
const mockDb = reactive({
  '1': {
    type: 'recruit',
    title: '蓝桥杯 Web 应用开发国赛组队，缺一后端！',
    author: '前端小牛',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=牛',
    updatedTime: '2 小时前',
    isFavorite: false,
    content: `
      <p>目前我们队伍有一个前端和一个UI，准备报名今年的蓝桥杯Web赛道。前端技术栈是Vue3+Pinia，UI用Figma。</p>
      <h3>我们需要的队友</h3>
      <p>现在急需一名熟悉 Node.js 或者 Java SpringBoot 的后端大佬加入。</p>
      <h3>时间与要求</h3>
      <p>比赛期间一周最好能抽出10小时一起交流，如果有微服务经验或者搞过大屏可视化优先。希望你能负责后端的接口开发、数据库设计以及最后的服务器部署。</p>
      <pre><code>// 示例代码栈要求
const stack = ['Node.js', 'Express/Koa', 'MySQL/MongoDB', 'Redis'];
if (stack.every(tech => user.knows(tech))) {
  joinOurTeam();
}</code></pre>
    `,
    tags: ['Web开发', '蓝桥杯', '寻找后端'],
    views: 1256,
    commentCount: 8
  },
  '3': {
    type: 'recruit',
    title: '大创国家级立项，做校园闲置物品流转系统，求移动端开发人员',
    author: '极客实验室',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=极客',
    updatedTime: '昨天',
    isFavorite: true,
    content: `
      <p>我们的大创项目已经成功拿到国家级立项，目前预算充足。系统主要做校园内的二手闲置流转，结合智能推荐算法。后端基础搭建已完成。</p>
      <h3>招募方向：大前端</h3>
      <p>现求一两名熟悉 Uni-app 或 鸿蒙系统开发的同学，一起将系统落地。如果有原生安卓/iOS经验也可以。</p>
      <p>团队氛围极好，大四学长带队，有机会直接指导你的毕业设计。项目结束有丰厚的奖金分成！</p>
    `,
    tags: ['大创', '资金充裕', 'APP开发'],
    views: 342,
    commentCount: 23
  }
})

const detailData = computed(() => {
  return mockDb[postId.value] || { 
    title: '未找到内容', 
    content: '<p>这篇帖子已经被吸入赛博黑洞...</p>', 
    author: 'System', 
    updatedTime: '未知', 
    type: 'unknown',
    tags: []
  }
})

// ============== 动态提取目录 (TOC) 与内容解析 ==============
const parsedContent = computed(() => {
  let html = detailData.value.content || ''
  return html.replace(/<h3[^>]*>(.*?)<\/h3>/g, (match, p1) => {
    const id = p1.replace(/<[^>]+>/g, '').trim()
    return `<h3 id="${id}">${p1}</h3>`
  })
})

const tocLinks = computed(() => {
  const links = []
  const html = detailData.value.content || ''
  const regex = /<h3[^>]*>(.*?)<\/h3>/g
  let match
  while ((match = regex.exec(html)) !== null) {
    links.push(match[1].replace(/<[^>]+>/g, '').trim())
  }
  return links
})

const scrollToAnchor = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// ============== 交互逻辑 ==============
const isLikedAnim = ref(false)

const toggleFavorite = () => {
  if(detailData.value.type !== 'unknown') {
    detailData.value.isFavorite = !detailData.value.isFavorite
    if (detailData.value.isFavorite) {
      isLikedAnim.value = true
      setTimeout(() => { isLikedAnim.value = false }, 800)
    }
  }
}

// ============== 申请弹窗逻辑 ==============
const showApplyModal = ref(false)
const advantageText = ref('')
const errorMessage = ref('')
const applyStatus = ref('none')

// 防止弹窗出现时滚动穿透
const preventScroll = (e) => e.preventDefault()
const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('touchmove', preventScroll, { passive: false })
}
const unlockBodyScroll = () => {
  document.body.style.overflow = ''
  document.removeEventListener('touchmove', preventScroll)
}

onMounted(() => {
  const savedStatus = localStorage.getItem(`apply_status_post_${postId.value}`)
  if (savedStatus) {
    applyStatus.value = savedStatus
  }
})

onUnmounted(() => {
  unlockBodyScroll()
})

const openApplyModal = () => {
  if (applyStatus.value !== 'none') return
  advantageText.value = ''
  errorMessage.value = ''
  showApplyModal.value = true
  lockBodyScroll() // 修复杂乱的遮住问题
}

const closeApplyModal = () => {
  showApplyModal.value = false
  unlockBodyScroll()
}

const submitApplication = () => {
  if (advantageText.value.trim().length < 5) {
    errorMessage.value = '请至少输入5个字来描述你的优势'
    return
  }
  applyStatus.value = 'reviewing'
  localStorage.setItem(`apply_status_post_${postId.value}`, 'reviewing')
  closeApplyModal()
}
</script>

<template>
  <div class="page-background">
    <!-- 核心排版：左侧正文，右侧悬浮卡片 -->
    <div class="layout-wrapper">
      <main class="main-content">
        <article class="article-box">
          <!-- 内部导航区：返回大厅与收藏 -->
          <div class="card-top-actions">
            <button class="gh-btn-subtle mini-back" @click="goBack">
              <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right:4px;"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              返回大厅
            </button>
            <button 
              class="action-btn" 
              :class="{ 'is-favorite': detailData.isFavorite, 'anim-pop': isLikedAnim }" 
              @click="toggleFavorite"
            >
              <svg v-if="detailData.isFavorite" class="btn-icon" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <svg v-else class="btn-icon" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
              <span class="text-hide-mobile">{{ detailData.isFavorite ? '已收藏' : '收藏' }}</span>
            </button>
          </div>

          <h1 class="article-title">
            <span v-if="detailData.type === 'recruit'" class="status-badge bg-green">招募</span>
            <span v-if="detailData.type === 'share'" class="status-badge bg-blue">分享</span>
            {{ detailData.title }}
          </h1>

          <div class="article-meta">
            <img :src="detailData.avatar" alt="avatar" class="author-avatar" v-if="detailData.avatar" />
            <div class="meta-info">
              <span class="author-name">{{ detailData.author }}</span>
              <span class="publish-time">{{ detailData.updatedTime }} · {{ detailData.views || 0 }} 次浏览</span>
            </div>
          </div>

          <!-- 现代排版 Markdown 内容渲染区 -->
          <div class="markdown-body" v-html="parsedContent"></div>
          
          <div class="article-tags" v-if="detailData.tags && detailData.tags.length">
             <span class="tech-tag" v-for="tag in detailData.tags" :key="tag"># {{ tag }}</span>
          </div>
        </article>
      </main>

      <!-- 右侧发起人信息/操作栏 (吸顶) -->
      <aside class="sidebar-wrapper">
        <div class="sticky-sidebar">
          <div class="author-card">
            <div class="card-header">关于发起人</div>
            <div class="card-body">
              <img :src="detailData.avatar" alt="avatar" class="large-avatar" v-if="detailData.avatar" />
              <div class="info">
                <div class="name">{{ detailData.author }}</div>
                <div class="title">CampusHub 认证极客</div>
              </div>
            </div>
            <div class="card-footer">
              <button class="gh-btn-subtle full-width">查看TA的档案</button>
            </div>
          </div>

          <!-- 行动召唤卡片 -->
          <div class="action-card" v-if="detailData.type === 'recruit'">
             <div class="pulse-status" :class="applyStatus">
                <span class="pulse-dot"></span>
                {{ applyStatus === 'none' ? '组队通道开启中' : applyStatus === 'reviewing' ? '简历正在审核中' : '您已成功入队' }}
             </div>
             
             <button 
                class="gh-btn-primary full-width huge-btn" 
                :class="{'btn-disabled': applyStatus !== 'none'}"
                @click="openApplyModal"
                :disabled="applyStatus !== 'none'"
              >
                {{ applyStatus === 'none' ? '立刻申请入队' : applyStatus === 'reviewing' ? '等待对方回复...' : '组队成功' }}
              </button>
          </div>

          <!-- 目录卡片 (TOC) -->
          <div class="toc-card" v-if="tocLinks.length > 0">
            <div class="toc-header">本页目录</div>
            <ul class="toc-list">
              <li v-for="link in tocLinks" :key="link" class="toc-item" @click="scrollToAnchor(link)">
                {{ link }}
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>

    <!-- 全屏高斯模态弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showApplyModal" class="modal-overlay" @click.self="closeApplyModal">
          <div class="modern-modal">
            <button class="close-btn" @click="closeApplyModal">
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
            
            <h2 class="modal-title">递交组队申请</h2>
            <p class="modal-subtitle">向 <b>{{ detailData.author }}</b> 展示你的硬实力。一段清晰优雅的代码经历能极大提高通过率。</p>
            
            <div class="form-group">
              <label class="form-label">技术栈与经验自述</label>
              <textarea 
                v-model="advantageText" 
                class="modern-textarea" 
                placeholder="例如：我熟悉 Vue3 + Pinia，做过两个独立的后台管理项目，可以独立承担前端页面构建..."
                rows="5"
              ></textarea>
              <div class="error-text" v-if="errorMessage">{{ errorMessage }}</div>
            </div>

            <div class="modal-actions-right">
              <button class="gh-btn-subtle" @click="closeApplyModal">稍后再说</button>
              <button class="gh-btn-primary shadow-btn" @click="submitApplication">
                发送申请信
                <svg viewBox="0 0 24 24" width="16" height="16" style="margin-left: 6px;"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-background {
  min-height: 100vh;
  background-color: var(--color-canvas-subtle);
  padding-bottom: 60px;
}

/* 大厂两栏布局 */
.layout-wrapper {
  max-width: 1040px;
  margin: 24px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
  align-items: start;
}

/* 左侧正文区 */
.main-content {
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--color-shadow);
}

.article-box {
  padding: 24px 32px 32px;
}

.card-top-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.mini-back {
  padding: 6px 12px;
  font-size: 13px;
}

.article-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-fg-default);
  line-height: 1.4;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.status-badge {
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  vertical-align: middle;
  margin-right: 12px;
}
.bg-green { background: var(--color-success-bg); }
.bg-blue { background: var(--color-accent-fg); }

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-muted);
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-fg-default);
}

.publish-time {
  font-size: 13px;
  color: var(--color-fg-muted);
}

/* 高级 Markdown 排版 */
.markdown-body {
  line-height: 1.8;
  font-size: 16px;
  color: var(--color-fg-default);
}

:deep(h3) {
  font-size: 20px;
  font-weight: 700;
  margin: 32px 0 16px;
  padding-left: 12px;
  border-left: 4px solid var(--color-accent-fg);
  color: var(--color-fg-default);
}

:deep(p) {
  margin-bottom: 16px;
  color: var(--color-fg-default);
}

:deep(pre) {
  background-color: #0d1117;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 24px 0;
  border: 1px solid #30363d;
}

:deep(code) {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 14px;
  color: #c9d1d9;
}

[data-theme='light'] :deep(pre) {
  background-color: #f6f8fa;
  border-color: #d0d7de;
}
[data-theme='light'] :deep(code) { color: #24292f; }

.article-tags {
  display: flex;
  gap: 12px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px dashed var(--color-border-muted);
}

.tech-tag {
  color: var(--color-accent-fg);
  background: rgba(9, 105, 218, 0.08);
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}
[data-theme='dark'] .tech-tag { background: rgba(47, 129, 247, 0.15); }


/* 右侧侧边栏 */
.sticky-sidebar {
  position: sticky;
  top: 84px; /* 60px main nav + 24px gap */
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.author-card, .action-card {
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px var(--color-shadow);
}

.card-header {
  padding: 16px 20px;
  background: var(--color-canvas-subtle);
  border-bottom: 1px solid var(--color-border-muted);
  font-weight: 600;
  font-size: 14px;
}

.card-body {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.large-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid var(--color-border-default);
}

.info .name { font-size: 16px; font-weight: 700; color: var(--color-fg-default); margin-bottom: 4px; }
.info .title { font-size: 12px; color: var(--color-success-fg); background: var(--color-success-bg); padding: 2px 8px; border-radius: 10px; color: #fff; display: inline-block;}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-canvas-subtle);
}

.action-card {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pulse-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-muted);
}

.pulse-status.none .pulse-dot { background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: pulse 2s infinite; }
.pulse-status.reviewing .pulse-dot { background: #f59e0b; }
.pulse-status.approved .pulse-dot { background: var(--color-accent-fg); }

.pulse-dot { width: 8px; height: 8px; border-radius: 50%; }

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

/* 按钮通用 */
.gh-btn-subtle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid var(--color-border-default);
  background: var(--color-btn-bg);
  color: var(--color-fg-default);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.gh-btn-subtle:hover { background: var(--color-btn-hover-bg); border-color: var(--color-border-muted); }

.gh-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-btn-primary-bg);
  color: #fff;
  border: 1px solid var(--color-btn-primary-border);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.gh-btn-primary:hover:not(:disabled) { background: var(--color-btn-primary-hover-bg); transform: translateY(-1px); }

.full-width { width: 100%; }
.huge-btn { padding: 14px; font-size: 16px; }

.btn-disabled {
  background: var(--color-btn-bg) !important;
  color: var(--color-fg-subtle) !important;
  border-color: var(--color-border-default) !important;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn { background: none; border: none; font-size: 14px; font-weight: 500; color: var(--color-fg-muted); cursor: pointer; display: flex; align-items: center; gap: 6px; position: relative;}
.action-btn.is-favorite { color: #f43f5e; }
.action-btn:hover { color: var(--color-fg-default); }

/* 收藏点赞微动效 */
.anim-pop .btn-icon {
  animation: heart-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes heart-pop {
  0% { transform: scale(1); }
  25% { transform: scale(0.8); }
  50% { transform: scale(1.3); }
  75% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

/* TOC 目录卡片 */
.toc-card {
  background: transparent;
  padding: 0 4px;
}

.toc-header {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-fg-default);
  margin-bottom: 12px;
  padding-left: 8px;
}

.toc-list {
  display: flex;
  flex-direction: column;
  position: relative;
}

.toc-list::before {
  content: '';
  position: absolute;
  left: 3px; top: 0; bottom: 0;
  width: 2px;
  background: var(--color-border-subtle);
}

.toc-item {
  font-size: 13px;
  color: var(--color-fg-muted);
  padding: 6px 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.toc-item:hover {
  color: var(--color-accent-fg);
}

.toc-item::before {
  content: '';
  position: absolute;
  left: 1px; top: 50%;
  transform: translateY(-50%);
  width: 6px; height: 6px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s;
}

.toc-item:hover::before {
  background: var(--color-accent-fg);
}

/* 模态框 Teleport (极客风) */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modern-modal {
  position: relative;
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-muted);
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 24px 48px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  color: var(--color-fg-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
}
.close-btn:hover { background: var(--color-canvas-subtle); color: var(--color-fg-default); }

.modal-title { font-size: 22px; font-weight: 800; color: var(--color-fg-default); margin-bottom: 8px; }
.modal-subtitle { font-size: 14px; color: var(--color-fg-muted); margin-bottom: 24px; line-height: 1.5; }

.form-group { margin-bottom: 24px; }
.form-label { display: block; font-size: 14px; font-weight: 600; color: var(--color-fg-default); margin-bottom: 8px; }

.modern-textarea {
  width: 100%;
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-fg-default);
  resize: vertical;
  transition: all 0.2s;
  outline: none;
}

.modern-textarea:focus {
  background: var(--color-canvas-default);
  border-color: var(--color-accent-fg);
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.2);
}

.error-text { margin-top: 8px; color: #cf222e; font-size: 13px; font-weight: 500; }

.modal-actions-right {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.shadow-btn { box-shadow: 0 4px 12px rgba(45, 164, 78, 0.3); }

/* 弹窗动画 */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }

/* 响应式 */
@media screen and (max-width: 768px) {
  .layout-wrapper { grid-template-columns: 1fr; padding: 0; margin-top: 0;}
  .article-box { padding: 20px; border-radius: 0; border-left: none; border-right: none;}
  .article-title { font-size: 24px; }
  .sticky-sidebar { position: static; padding: 0 20px 20px; gap: 16px; }
}
</style>
