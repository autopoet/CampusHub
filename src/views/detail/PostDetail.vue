<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMockStore } from '@/stores/mockStore'
import { geekToast } from '@/utils/toast.js'

const router = useRouter()
const route = useRoute()
const store = useMockStore()

// 获取路由中的 ID 和 类型
const postId = computed(() => route.params.id)
const postType = computed(() => route.params.type)

// 响应式状态管理详细数据与评论
const loading = ref(true)
const detailData = ref({
  title: '',
  content: '',
  author: '',
  avatar: '',
  updatedTime: '',
  type: 'unknown',
  tags: [],
  competition: '',
  status: '',
  isFavorite: false,
  commentCount: 0
})

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(async () => {
  loading.value = true
  
  // 1. 根据路由 type 加载对应详情 (修复 Bug: 使用 loadShareById)
  let post = null;
  if (postType.value === 'recruit') {
    post = await store.loadRecruitmentById(postId.value);
  } else {
    post = await store.loadShareById(postId.value);
  }
  
  if (post) {
    detailData.value = { ...post };
  } else {
    geekToast.error('未找到该内容');
    // 如果没找到，2秒后返回上一页
    setTimeout(() => {
      if (route.name === 'detail') router.push('/home/index');
    }, 2000);
  }

  // 2. 加载评论（根据帖子 ID 过滤）
  await store.loadComments(postId.value)
  
  loading.value = false
})

// ============== 动态提取目录 (TOC) 与内容解析 ==============
const parsedContent = computed(() => {
  let html = detailData.value.content || ''
  // 自动为 h3 添加 ID 用于锚点跳转
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
    const text = match[1].replace(/<[^>]+>/g, '').trim()
    if (text) links.push(text)
  }
  return links
})

const scrollToAnchor = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100
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
      geekToast.success('已加入我的收藏夹')
      setTimeout(() => { isLikedAnim.value = false }, 800)
    } else {
      geekToast.info('已取消收藏')
    }
    // 注意：这里实际项目中应调用 API 同步到后端
  }
}

// ============== 申请弹窗逻辑 ==============
const showApplyModal = ref(false)
const advantageText = ref('')
const errorMessage = ref('')
const applyStatus = ref('none')

// 防止弹窗出现时滚动穿透
const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

onMounted(() => {
  const savedStatus = localStorage.getItem(`apply_status_post_${postType.value}_${postId.value}`)
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
  document.body.style.overflow = 'hidden'
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
  localStorage.setItem(`apply_status_post_${postType.value}_${postId.value}`, 'reviewing')
  geekToast.success('申请发送成功，请等待发起人联系')
  closeApplyModal()
}
</script>

<template>
  <div class="detail-page-container">
    <!-- 背景装饰 (网格与模糊球) -->
    <div class="bg-decorations">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="layout-wrapper" v-if="!loading && detailData.title">
      <main class="main-content-area">
        <!-- 文章主体卡片 -->
        <article class="article-glass-card">
          <div class="article-header-actions">
            <button class="action-icon-btn back-btn" @click="goBack" title="返回">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>返回</span>
            </button>
            <div class="header-right-btns">
              <button 
                class="action-icon-btn favorite-btn" 
                :class="{ 'is-active': detailData.isFavorite, 'anim-pop': isLikedAnim }" 
                @click="toggleFavorite"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" :fill="detailData.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{{ detailData.isFavorite ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </div>

          <!-- 标题与状态标签 -->
          <div class="title-section">
            <div class="type-badge" :class="postType">
              {{ postType === 'recruit' ? '组队招募' : '干货分享' }}
            </div>
            <h1 class="main-title">{{ detailData.title }}</h1>
            
            <!-- 招募特有字段：比赛与状态 -->
            <div class="recruit-meta-tags" v-if="postType === 'recruit'">
              <span class="meta-tag competition" v-if="detailData.competition">
                🏆 {{ detailData.competition }}
              </span>
              <span class="meta-tag status" :class="detailData.status === '招募中' ? 'active' : 'full'">
                {{ detailData.status }}
              </span>
            </div>
          </div>

          <!-- 作者信息行 -->
          <div class="author-bar">
            <div class="author-info">
              <div class="avatar-wrapper">
                <img :src="detailData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${detailData.author}`" class="author-avatar" />
              </div>
              <div class="author-text">
                <span class="name">{{ detailData.author }}</span>
                <span class="time">{{ detailData.updatedTime }} 发布 · 1.2k 阅读</span>
              </div>
            </div>
          </div>

          <!-- 正文 -->
          <div class="article-body markdown-content" v-html="parsedContent"></div>
          
          <!-- 底部标签 -->
          <div class="tag-cloud" v-if="detailData.tags && detailData.tags.length > 0">
             <span class="bubble-tag" v-for="tag in detailData.tags" :key="tag"># {{ tag }}</span>
          </div>
        </article>

        <!-- 评论模块 -->
        <section class="comment-glass-section">
          <div class="section-title">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.5 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
            </svg>
            <h3>大家在说 ({{ store.comments.length }})</h3>
          </div>

          <div v-if="store.comments.length === 0" class="empty-comments">
             <div class="empty-icon">💬</div>
             <p>暂无评论，快来发表你的见解吧！</p>
          </div>
          
          <div v-else class="comment-stream">
             <div v-for="comment in store.comments" :key="comment.id" class="comment-bubble">
                <div class="comment-user-avatar">
                   {{ comment.author_name ? comment.author_name[0] : 'U' }}
                </div>
                <div class="comment-content-wrap">
                   <div class="comment-top">
                      <span class="comment-user">用户 #{{ comment.author_id }}</span>
                      <span class="comment-date">{{ comment.created_at }}</span>
                   </div>
                   <p class="comment-message">{{ comment.content }}</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      <!-- 侧边栏 -->
      <aside class="sidebar-area">
        <div class="sidebar-sticky-box">
          
          <!-- 作者卡片 -->
          <div class="sidebar-glass-card author-side-card">
            <div class="card-title-sm">发布者资料</div>
            <div class="author-profile-large">
              <img :src="detailData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${detailData.author}`" class="profile-img" />
              <div class="p-name">{{ detailData.author }}</div>
              <div class="p-badge">CampusHub 官方认证</div>
              <div class="p-stats">
                <div class="stat-item"><span>12</span>文章</div>
                <div class="stat-item"><span>5</span>项目</div>
                <div class="stat-item"><span>1.5k</span>粉丝</div>
              </div>
              <button class="follow-btn">关注作者</button>
            </div>
          </div>

          <!-- 招募操作区 -->
          <div class="sidebar-glass-card recruit-action-card" v-if="postType === 'recruit'">
             <div class="card-title-sm">参与项目</div>
             <p class="action-desc">对这个竞赛感兴趣？点击下方按钮向发起人展示你的优势并申请加入队伍。</p>
             <button 
                class="apply-prime-btn" 
                :class="{'btn-loading': applyStatus !== 'none'}"
                @click="openApplyModal"
                :disabled="applyStatus !== 'none'"
              >
                <svg v-if="applyStatus === 'none'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" style="margin-right:6px">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                <span>{{ applyStatus === 'none' ? '立刻申请入队' : '申请已提交 · 审核中' }}</span>
              </button>
          </div>

          <!-- 文章目录 -->
          <div class="sidebar-glass-card toc-side-card" v-if="tocLinks.length > 0">
            <div class="card-title-sm">文章目录</div>
            <nav class="toc-navigation">
              <div 
                v-for="(link, idx) in tocLinks" 
                :key="link" 
                class="toc-nav-item" 
                @click="scrollToAnchor(link)"
              >
                <span class="idx">0{{ idx + 1 }}</span>
                <span class="txt">{{ link }}</span>
              </div>
            </nav>
          </div>

        </div>
      </aside>
    </div>

    <!-- 加载中 -->
    <div v-else class="loading-state-container">
       <div class="premium-spinner"></div>
       <p>正在从 CampusHub 安全中心加载数据...</p>
    </div>

    <!-- 申请弹窗 (Teleport) -->
    <Teleport to="body">
      <Transition name="modal-bounce">
        <div v-if="showApplyModal" class="modal-backdrop" @click.self="closeApplyModal">
          <div class="premium-modal">
            <div class="modal-header">
              <h2>项目入队申请</h2>
              <button class="close-btn" @click="closeApplyModal">×</button>
            </div>
            <div class="modal-body">
              <label class="input-label">我的核心优势</label>
              <textarea 
                v-model="advantageText" 
                class="premium-textarea" 
                placeholder="例如：我有 2 年 Vue 开发经验，参加过 3 次国赛..."
              ></textarea>
              <div class="error-hint" v-if="errorMessage">{{ errorMessage }}</div>
              
              <div class="tips-box">
                 <p>💡 提示：诚恳的态度和详细的过往经历更容易获得队长的认可。</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="ghost-btn" @click="closeApplyModal">我再想想</button>
              <button class="prime-btn" @click="submitApplication">正式发送申请</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================
   布局与大背景
   ============================ */
.detail-page-container { 
  min-height: 100vh; 
  position: relative; 
  background-color: var(--color-canvas-subtle); 
  padding: 40px 0 80px; 
  overflow-x: hidden;
}

.bg-decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}
.blob-1 { top: -10%; left: -10%; background: var(--color-accent-fg); }
.blob-2 { bottom: -10%; right: -10%; background: #8b5cf6; }

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--color-border-default) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.2;
}

.layout-wrapper { 
  position: relative;
  z-index: 1;
  max-width: 1140px; 
  margin: 0 auto; 
  display: grid; 
  grid-template-columns: 1fr 340px; 
  gap: 32px; 
  padding: 0 24px; 
}

/* ============================
   主内容区 (玻璃卡片感)
   ============================ */
.article-glass-card, .comment-glass-section, .sidebar-glass-card {
  background: rgba(var(--color-canvas-default-rgb, 255, 255, 255), 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.05);
}

.article-glass-card { padding: 48px; margin-bottom: 32px; transition: transform 0.3s ease; }

.article-header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }

.action-icon-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border-default);
  background: var(--color-canvas-default);
  color: var(--color-fg-default);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-icon-btn:hover { background: var(--color-canvas-subtle); border-color: var(--color-accent-fg); transform: translateY(-2px); }

.favorite-btn.is-active { color: #f43f5e; border-color: #fca5a1; background: #fff1f2; }

/* 标题与标签 */
.type-badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 16px; }
.type-badge.recruit { background: rgba(9, 105, 218, 0.1); color: var(--color-accent-fg); }
.type-badge.share { background: rgba(22, 163, 74, 0.1); color: #16a34a; }

.main-title { font-size: 42px; font-weight: 800; color: var(--color-fg-default); line-height: 1.25; margin-bottom: 20px; letter-spacing: -1px; }

.recruit-meta-tags { display: flex; gap: 12px; margin-bottom: 32px; }
.meta-tag { padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; }
.competition { background: #fffbeb; color: #b45309; border: 1px solid #fef3c7; }
.status.active { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
.status.full { background: #f9fafb; color: #6b7280; border: 1px solid #f3f4f6; }

/* 作者行 */
.author-bar { border-top: 1px solid var(--color-border-muted); border-bottom: 1px solid var(--color-border-muted); padding: 24px 0; margin-bottom: 40px; }
.author-info { display: flex; align-items: center; gap: 16px; }
.author-avatar { width: 56px; height: 56px; border-radius: 20px; object-fit: cover; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.author-text { display: flex; flex-direction: column; gap: 4px; }
.author-text .name { font-size: 17px; font-weight: 700; color: var(--color-fg-default); }
.author-text .time { font-size: 13px; color: var(--color-fg-muted); }

/* Markdown 内容样式 */
.markdown-content { font-size: 18px; line-height: 1.8; color: var(--color-fg-default); }
.markdown-content :deep(h3) { font-size: 24px; font-weight: 700; margin: 40px 0 20px; color: var(--color-fg-default); }
.markdown-content :deep(p) { margin-bottom: 24px; }

.tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 60px; }
.bubble-tag { padding: 6px 16px; border-radius: 20px; background: var(--color-canvas-subtle); color: var(--color-fg-muted); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.bubble-tag:hover { background: var(--color-accent-fg); color: #fff; }

/* ============================
   评论区
   ============================ */
.comment-glass-section { padding: 40px; }
.section-title { display: flex; align-items: center; margin-bottom: 32px; color: var(--color-fg-default); }
.section-title h3 { font-size: 20px; font-weight: 700; margin: 0; }

.comment-bubble { display: flex; gap: 16px; margin-bottom: 32px; animation: fadeInUp 0.5s ease backwards; }
.comment-user-avatar { width: 40px; height: 40px; border-radius: 12px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #475569; flex-shrink: 0; }
.comment-content-wrap { flex: 1; padding: 16px 20px; background: var(--color-canvas-subtle); border-radius: 0 16px 16px 16px; border: 1px solid var(--color-border-muted); }
.comment-top { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
.comment-user { font-weight: 700; color: var(--color-fg-default); }
.comment-date { color: var(--color-fg-subtle); }
.comment-message { font-size: 15px; color: var(--color-fg-muted); line-height: 1.6; }

/* ============================
   侧边栏
   ============================ */
.sidebar-sticky-box { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
.sidebar-glass-card { padding: 28px; }
.card-title-sm { font-size: 14px; font-weight: 800; color: var(--color-fg-subtle); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }

.author-profile-large { text-align: center; }
.profile-img { width: 80px; height: 80px; border-radius: 28px; margin-bottom: 16px; border: 3px solid #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.p-name { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.p-badge { font-size: 12px; color: var(--color-accent-fg); font-weight: 600; margin-bottom: 20px; }
.p-stats { display: flex; justify-content: space-around; margin-bottom: 24px; }
.stat-item { display: flex; flex-direction: column; font-size: 12px; color: var(--color-fg-subtle); }
.stat-item span { font-size: 18px; font-weight: 800; color: var(--color-fg-default); }

.follow-btn { width: 100%; padding: 12px; border-radius: 12px; border: none; background: var(--color-fg-default); color: var(--color-canvas-default); font-weight: 700; cursor: pointer; transition: transform 0.2s; }
.follow-btn:hover { transform: scale(1.02); }

.apply-prime-btn { width: 100%; display: flex; align-items: center; justify-content: center; padding: 16px; border-radius: 14px; border: none; background: var(--color-accent-fg); color: #fff; font-weight: 800; font-size: 16px; cursor: pointer; box-shadow: 0 8px 20px rgba(9, 105, 218, 0.3); transition: all 0.3s; }
.apply-prime-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(9, 105, 218, 0.4); }
.apply-prime-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #94a3b8; }

.toc-nav-item { display: flex; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; transition: 0.2s; align-items: center; }
.toc-nav-item:hover { background: var(--color-canvas-subtle); }
.toc-nav-item .idx { font-family: monospace; font-size: 12px; color: var(--color-accent-fg); font-weight: 800; opacity: 0.5; }
.toc-nav-item .txt { font-size: 14px; font-weight: 600; color: var(--color-fg-muted); }

/* ============================
   加载状态
   ============================ */
.loading-state-container { height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: var(--color-fg-muted); }
.premium-spinner { width: 48px; height: 48px; border: 4px solid var(--color-border-default); border-top-color: var(--color-accent-fg); border-radius: 50%; animation: spin 0.8s linear infinite; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ============================
   响应式
   ============================ */
@media screen and (max-width: 1024px) {
  .layout-wrapper { grid-template-columns: 1fr; }
  .sidebar-area { order: 2; }
}

@media screen and (max-width: 768px) {
  .article-glass-card { padding: 24px; border-radius: 0; border-left: none; border-right: none; }
  .main-title { font-size: 32px; }
  .comment-glass-section { padding: 24px; border-radius: 0; }
  .layout-wrapper { padding: 0; }
  .detail-page-container { padding: 0; }
}

/* ============================
   弹窗动画
   ============================ */
.modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
.premium-modal { width: 90%; max-width: 520px; background: var(--color-canvas-default); border-radius: 28px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.4); animation: modalBoxIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); }

@keyframes modalBoxIn { from { opacity: 0; transform: scale(0.8) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.modal-header { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-muted); }
.modal-header h2 { font-size: 20px; font-weight: 800; margin: 0; }
.close-btn { background: none; border: none; font-size: 32px; color: var(--color-fg-subtle); cursor: pointer; }

.modal-body { padding: 32px; }
.input-label { display: block; font-size: 14px; font-weight: 700; color: var(--color-fg-muted); margin-bottom: 12px; }
.premium-textarea { width: 100%; height: 160px; padding: 16px; border-radius: 16px; border: 2px solid var(--color-border-default); background: var(--color-canvas-subtle); color: var(--color-fg-default); font-family: inherit; font-size: 15px; resize: none; transition: 0.2s; }
.premium-textarea:focus { border-color: var(--color-accent-fg); outline: none; background: #fff; }

.tips-box { margin-top: 20px; padding: 12px 16px; background: #f0f9ff; border-radius: 12px; font-size: 13px; color: #0369a1; }

.modal-footer { padding: 24px 32px; background: var(--color-canvas-subtle); display: flex; justify-content: flex-end; gap: 12px; }
.ghost-btn { padding: 12px 24px; border-radius: 12px; border: none; background: transparent; color: var(--color-fg-subtle); font-weight: 700; cursor: pointer; }
.prime-btn { padding: 12px 28px; border-radius: 12px; border: none; background: var(--color-accent-fg); color: #fff; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(9, 105, 218, 0.2); }
</style>
