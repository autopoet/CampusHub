<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '@/components/ui/FeedCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import { geekToast } from '@/utils/toast.js'
import { useMockStore } from '@/stores/mockStore'

const router = useRouter()
const store = useMockStore()

// 使用 store 中的状态
const list = computed(() => store.recruitments)
const loading = ref(true)
const isLoadingMore = ref(false)

// 当前过滤状态
const currentFilters = ref({})

// 分页逻辑追踪
const currentPage = ref(1)
const hasMore = computed(() => {
  const pag = store.pagination.recruitments
  return pag.page < pag.totalPages
})

const observerTarget = ref(null)
let observer = null

const goToDetail = (item) => {
  router.push(`/home/detail/${item.type}/${item.id}`)
}

const loadData = async (append = false) => {
  if (!append) {
    loading.value = true
    currentPage.value = 1
  } else {
    isLoadingMore.value = true
  }

  // 构造过滤逻辑 (MockService 支持函数过滤)
  const filterFunc = (item) => {
    const f = currentFilters.value
    if (!f) return true
    
    // 关键字匹配
    if (f.keyword && !item.title.toLowerCase().includes(f.keyword.toLowerCase())) return false
    // 比赛匹配
    if (f.competition && item.competition !== f.competition) return false
    // 状态匹配
    if (f.status && item.status !== f.status) return false
    // 技能匹配 (多选 OR)
    if (f.skills && f.skills.length > 0) {
      const hasSkill = f.skills.some(s => item.requiredSkills && item.requiredSkills.includes(s))
      if (!hasSkill) return false
    }
    return true
  }

  await store._load('recruit', 'recruitments', { 
    page: currentPage.value, 
    pageSize: 8, 
    append,
    filter: filterFunc 
  })

  loading.value = false
  isLoadingMore.value = false
}

const handleFilter = (filters) => {
  currentFilters.value = filters
  loadData(false)
}

onMounted(async () => {
  await loadData(false)
  nextTick(() => {
    setupObserver()
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingMore.value && hasMore.value) {
        currentPage.value++
        loadData(true)
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px 400px 0px' }
  )
  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
  if (item.isFavorite) {
    geekToast.success('已加入我的收藏夹')
  } else {
    geekToast.info('已取消收藏')
  }
}

const sharePost = () => {
  geekToast.success('招募分享链接已复制到剪贴板！')
}
</script>

<template>
  <div class="recruit-view-wrap">
    <!-- 顶部过滤栏 -->
    <FilterBar 
      @filter="handleFilter" 
      placeholder="输入职位、项目或比赛关键字进行搜索..."
    />

    <div class="feed-list">
      <template v-if="loading">
        <SkeletonCard v-for="i in 3" :key="i" />
      </template>
      
      <template v-else-if="list.length === 0">
        <div class="empty-list">
          <div class="empty-icon">📂</div>
          <p>没有找到符合要求的招募信息</p>
          <button class="gh-btn-subtle" @click="handleFilter({})">清除筛选</button>
        </div>
      </template>

      <template v-else>
        <FeedCard
          v-for="item in list"
          :key="item.id"
          :author="item.author"
          :avatar="item.avatar"
          :action="item.action"
          :time="item.updatedTime"
          @click="goToDetail(item)"
        >
          <template #title>
            <h2 class="feed-title">
              {{ item.title }}
              <span class="status-badge" :class="item.status === '招募中' ? 'active' : 'full'">
                {{ item.status }}
              </span>
            </h2>
          </template>

          <template #tags>
            <span class="competition-tag" v-if="item.competition">{{ item.competition }}</span>
            <div class="skill-tags">
               <span v-for="(skill, index) in item.requiredSkills" :key="index" class="skill-item">
                {{ skill }}
              </span>
            </div>
          </template>

          <p class="summary-text">{{ item.excerpt }}</p>

          <template #footer>
            <div class="footer-actions">
              <div class="left-info">
                <span class="comment-stats">{{ item.commentCount || 0 }} 评论</span>
              </div>
              <div class="right-buttons">
                <button class="mini-icon-btn" @click.stop="sharePost" title="转发">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-7l-4-4-4 4m4-4v13"/></svg>
                </button>
                <button
                  class="mini-icon-btn"
                  :class="{ 'is-active': item.isFavorite }"
                  @click.stop="toggleFavorite(item)"
                  title="收藏"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" :fill="item.isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
          </template>
        </FeedCard>

        <!-- 无限滚动指示器 -->
        <div ref="observerTarget" class="scroll-footer">
          <div v-if="isLoadingMore" class="loading-more">
            <div class="spinner-sm"></div>
            <span>正在搜索更多职位...</span>
          </div>
          <div v-if="!hasMore && list.length > 0" class="end-msg">
             🚀 所有的招聘火苗都展示完啦
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.recruit-view-wrap { animation: fadeIn 0.4s ease-out; }

.feed-list { display: flex; flex-direction: column; gap: 20px; }

.feed-title { 
  font-size: 18px; 
  font-weight: 700; 
  color: var(--color-fg-default); 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.status-badge { 
  font-size: 11px; 
  padding: 3px 10px; 
  border-radius: 20px; 
  font-weight: 700;
  flex-shrink: 0;
}
.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.full { background: #f3f4f6; color: #6b7280; }

.competition-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #fffbeb;
  color: #b45309;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  margin-right: 10px;
}

.skill-tags { display: inline-flex; flex-wrap: wrap; gap: 6px; }
.skill-item { 
  font-size: 11px; 
  color: var(--color-fg-muted); 
  background: var(--color-canvas-subtle); 
  border: 1px solid var(--color-border-default);
  padding: 2px 8px;
  border-radius: 6px;
}

.summary-text { 
  font-size: 14.5px; 
  color: var(--color-fg-muted); 
  line-height: 1.6; 
  margin: 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer-actions { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding-top: 12px; 
  border-top: 1px solid var(--color-border-muted); 
}

.comment-stats { font-size: 13px; color: var(--color-fg-subtle); }

.right-buttons { display: flex; gap: 12px; }

.mini-icon-btn {
  background: none;
  border: none;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: 0.2s;
  padding: 6px;
  border-radius: 8px;
}

.mini-icon-btn:hover { background: var(--color-canvas-subtle); color: var(--color-accent-fg); }
.mini-icon-btn.is-active { color: #f43f5e; }

.empty-list { 
  padding: 80px 0; 
  text-align: center; 
  background: var(--color-canvas-default); 
  border-radius: 20px; 
  border: 1px dashed var(--color-border-default);
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-list p { color: var(--color-fg-muted); margin-bottom: 20px; }

.scroll-footer { padding: 40px 0; display: flex; justify-content: center; }
.loading-more { display: flex; align-items: center; gap: 12px; color: var(--color-fg-subtle); }
.spinner-sm { width: 20px; height: 20px; border: 2px solid var(--color-border-default); border-top-color: var(--color-accent-fg); border-radius: 50%; animation: spin 0.8s linear infinite; }
.end-msg { font-size: 14px; color: var(--color-fg-subtle); font-weight: 500; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
