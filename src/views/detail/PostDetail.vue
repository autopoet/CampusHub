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
  title: '加载中...',
  content: '',
  author: '',
  updatedTime: '',
  type: 'unknown',
  tags: []
})

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(async () => {
  loading.value = true
  
  // 1. 从 Store 加载帖子详情（已集成为 Mock API 调用）
  const post = await store.loadPostById(postId.value)
  if (post) {
    detailData.value = { ...post }
  } else {
    geekToast.error('未找到该内容')
  }

  // 2. 加载评论（根据帖子 ID 过滤）
  await store.loadComments(postId.value)
  
  loading.value = false
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
      geekToast.success('已加入我的收藏夹')
      setTimeout(() => { isLikedAnim.value = false }, 800)
    } else {
      geekToast.info('已取消收藏')
    }
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
  <div class="page-background">
    <div class="layout-wrapper" v-if="!loading">
      <main class="main-content">
        <article class="article-box">
          <div class="card-top-actions">
            <button class="gh-btn-subtle mini-back" @click="goBack">
              返回
            </button>
            <button 
              class="action-btn" 
              :class="{ 'is-favorite': detailData.isFavorite, 'anim-pop': isLikedAnim }" 
              @click="toggleFavorite"
            >
              <span class="text-hide-mobile">{{ detailData.isFavorite ? '已收藏' : '收藏' }}</span>
            </button>
          </div>

          <h1 class="article-title">
            {{ detailData.title }}
          </h1>

          <div class="article-meta">
            <img :src="detailData.avatar || 'https://via.placeholder.com/44'" alt="avatar" class="author-avatar" />
            <div class="meta-info">
              <span class="author-name">{{ detailData.author }}</span>
              <span class="publish-time">{{ detailData.updatedTime }}</span>
            </div>
          </div>

          <div class="markdown-body" v-html="parsedContent"></div>
          
          <div class="article-tags" v-if="detailData.tags">
             <span class="tech-tag" v-for="tag in detailData.tags" :key="tag"># {{ tag }}</span>
          </div>
        </article>

        <!-- 评论区集成 -->
        <section class="comment-section">
          <h3>评论 ({{ store.comments.length }})</h3>
          <div v-if="store.comments.length === 0" class="no-comments">
             暂无评论，快来抢沙发吧！
          </div>
          <div v-else class="comment-list">
             <div v-for="comment in store.comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                   <span class="comment-author">用户 #{{ comment.author_id }}</span>
                   <span class="comment-time">{{ comment.created_at }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
             </div>
          </div>
        </section>
      </main>

      <aside class="sidebar-wrapper">
        <div class="sticky-sidebar">
          <div class="author-card">
            <div class="card-header">发布者</div>
            <div class="card-body">
              <img :src="detailData.avatar || 'https://via.placeholder.com/56'" class="large-avatar" />
              <div class="info">
                <div class="name">{{ detailData.author }}</div>
                <div class="title">CampusHub 认证</div>
              </div>
            </div>
          </div>

          <div class="action-card" v-if="detailData.type === 'recruit' || postType === 'recruit'">
             <button 
                class="gh-btn-primary full-width huge-btn" 
                :class="{'btn-disabled': applyStatus !== 'none'}"
                @click="openApplyModal"
                :disabled="applyStatus !== 'none'"
              >
                {{ applyStatus === 'none' ? '立刻申请入队' : '正在申请中' }}
              </button>
          </div>

          <div class="toc-card" v-if="tocLinks.length > 0">
            <div class="toc-header">目录</div>
            <ul class="toc-list">
              <li v-for="link in tocLinks" :key="link" class="toc-item" @click="scrollToAnchor(link)">
                {{ link }}
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>

    <!-- 加载中 Skeleton 或 Spinner (简化版) -->
    <div v-else class="loading-full-page">
       正在连接后端模拟服务...
    </div>

    <!-- 申请弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showApplyModal" class="modal-overlay" @click.self="closeApplyModal">
          <div class="modern-modal">
            <h2 class="modal-title">申请加入项目</h2>
            <div class="form-group">
              <textarea v-model="advantageText" class="modern-textarea" placeholder="描述你的优势..."></textarea>
              <div class="error-text" v-if="errorMessage">{{ errorMessage }}</div>
            </div>
            <div class="modal-actions-right">
              <button class="gh-btn-subtle" @click="closeApplyModal">取消</button>
              <button class="gh-btn-primary" @click="submitApplication">发送申请</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-background { min-height: 100vh; background: var(--color-canvas-subtle); padding: 32px 0; }
.layout-wrapper { max-width: 1040px; margin: 0 auto; display: grid; grid-template-columns: 1fr 300px; gap: 24px; padding: 0 20px; }
.main-content { background: var(--color-canvas-default); border-radius: 12px; border: 1px solid var(--color-border-default); }
.article-box { padding: 32px; }
.article-title { font-size: 32px; font-weight: 800; margin-bottom: 24px; }
.article-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; color: var(--color-fg-muted); }
.author-avatar { width: 44px; height: 44px; border-radius: 50%; }
.markdown-body { line-height: 1.8; font-size: 16.5px; }
.comment-section { padding: 32px; border-top: 1px solid var(--color-border-subtle); }
.comment-item { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border-subtle); }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: var(--color-fg-muted); }
.comment-text { font-size: 15px; color: var(--color-fg-default); }
.sticky-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
.author-card, .action-card { background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 12px; padding: 24px; }
.gh-btn-primary { background: var(--color-accent-fg); color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 700; }
.gh-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.loading-full-page { display: flex; align-items: center; justify-content: center; height: 80vh; font-size: 18px; color: var(--color-fg-muted); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modern-modal { background: var(--color-canvas-default); padding: 32px; border-radius: 16px; width: 90%; max-width: 500px; }
.modern-textarea { width: 100%; border: 1px solid var(--color-border-default); border-radius: 8px; padding: 12px; height: 120px; font-family: inherit; margin-bottom: 12px; }
/* ... 简化其他样式 ... */
</style>
