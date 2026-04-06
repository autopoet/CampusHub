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
const list = computed(() => store.shares)
const loading = ref(true)
const isLoadingMore = ref(false)

// 当前过滤状态
const currentFilters = ref({})

// 分页逻辑追踪
const currentPage = ref(1)
const hasMore = computed(() => {
  const pag = store.pagination.shares
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
    // 专题匹配 (对应 competition)
    if (f.competition && item.competition !== f.competition) return false
    // 标签匹配 (Skills)
    if (f.skills && f.skills.length > 0) {
      const hasTag = f.skills.some(s => item.tags && item.tags.includes(s))
      if (!hasTag) return false
    }
    return true
  }

  await store._load('shares', 'shares', { 
    page: currentPage.value, 
    pageSize: 10, 
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

const shareNow = () => {
  geekToast.success('干货文章链接已复制！')
}
</script>

<template>
  <div class="share-view-wrap">
    <!-- 顶部过滤栏 (专题、标签搜索) -->
    <FilterBar 
      @filter="handleFilter" 
      placeholder="搜索经验、教程或面经关键字..."
      :showStatus="false"
    />

    <div class="feed-list">
      <template v-if="loading">
        <SkeletonCard v-for="i in 3" :key="i" />
      </template>
      
      <template v-else-if="list.length === 0">
        <div class="empty-list">
          <div class="empty-icon">☕</div>
          <p>没有找到相关干货，换个关键词搜搜看？</p>
          <button class="gh-btn-subtle" @click="handleFilter({})">全部文章</button>
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
            <h2 class="feed-title">{{ item.title }}</h2>
          </template>

          <template #tags>
            <span class="special-tag" v-if="item.competition">{{ item.competition }}</span>
            <div class="info-tags">
               <span v-for="(tag, index) in item.tags" :key="index" class="tag-item">
                # {{ tag }}
              </span>
            </div>
          </template>

          <p class="summary-text">{{ item.excerpt }}</p>

          <template #footer>
            <div class="footer-actions">
              <div class="left-info">
                <span class="view-stats">{{ (item.id * 123) % 456 + 100 }} 阅读</span>
                <span class="divider">·</span>
                <span class="comment-stats">{{ item.commentCount || 0 }} 评论</span>
              </div>
              <div class="right-buttons">
                <button class="mini-icon-btn" @click.stop="shareNow" title="分享">
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
            <span>正在挖掘更多宝藏...</span>
          </div>
          <div v-if="!hasMore && list.length > 0" class="end-msg">
             🍃 到底啦，别再刷了快去学习
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.share-view-wrap { animation: fadeIn 0.4s ease-out; }

.feed-list { display: flex; flex-direction: column; gap: 20px; }

.feed-title { 
  font-size: 18px; 
  font-weight: 700; 
  color: var(--color-fg-default); 
  margin-bottom: 12px;
  line-height: 1.4;
}

.special-tag {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-canvas-subtle);
  color: var(--color-accent-fg);
  font-size: 11px;
  font-weight: 800;
  border-radius: 8px;
  border: 1px solid var(--color-border-default);
  margin-right: 10px;
  vertical-align: middle;
}

.info-tags { display: inline-flex; flex-wrap: wrap; gap: 8px; vertical-align: middle; }
.tag-item { 
  font-size: 12px; 
  color: var(--color-fg-subtle);
  font-weight: 500;
}

.summary-text { 
  font-size: 14.5px; 
  color: var(--color-fg-muted); 
  line-height: 1.7; 
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

.left-info { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--color-fg-subtle); }
.divider { opacity: 0.3; }

.right-buttons { display: flex; gap: 12px; }

.mini-icon-btn {
  background: none;
  border: none;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: 0.2s;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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
