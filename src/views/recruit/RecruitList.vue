<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '@/components/ui/FeedCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { geekToast } from '@/utils/toast.js'
import { useMockStore } from '@/stores/mockStore'

const router = useRouter()
const store = useMockStore()

// 使用 store 中的状态，确保逻辑链条由全局状态管理
const list = computed(() => store.recruitments)
const loading = ref(true)
const isLoadingMore = ref(false)

// 分页逻辑追踪
const currentPage = ref(1)
const hasMore = computed(() => {
  const pag = store.pagination.recruitments
  return pag.page < pag.totalPages
})

const observerTarget = ref(null)
let observer = null

const goToDetail = (item) => {
  // 确保路由参数 type 与后端的 id 一致
  router.push(`/home/detail/${item.type}/${item.id}`)
}

onMounted(async () => {
  // 初始加载第一页数据
  currentPage.value = 1
  await store.loadRecruitments(currentPage.value, false) // replace mode
  loading.value = false
  
  // 等待 DOM 渲染后检测是否触发无限滚动
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
        handleLoadMore()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px 300px 0px' }
  )
  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

const handleLoadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  
  isLoadingMore.value = true
  currentPage.value++
  
  // 修改：这里不再手写模拟数据，而是发起 store 加载并 append
  await store.loadRecruitments(currentPage.value, true) // append mode
  
  isLoadingMore.value = false
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
  <div class="topstory-content">
    <div class="feed-list">
      <template v-if="loading">
        <SkeletonCard v-for="i in 3" :key="i" />
      </template>
      
      <template v-else>
        <FeedCard
          v-for="item in list"
          :key="item.id"
          :author="item.author"
          :action="item.action"
          :time="item.updatedTime"
          @click="goToDetail(item)"
        >
          <template #title>
            <h2 class="feed-title">
              {{ item.title }}
              <span class="status-tag" :class="item.status === '招募中' ? 'status-active' : 'status-full'">
                {{ item.status }}
              </span>
            </h2>
          </template>

          <template #tags>
            <span class="comp-tag" v-if="item.competition">{{ item.competition }}</span>
            <template v-if="item.requiredSkills">
               <span v-for="(skill, index) in item.requiredSkills" :key="index" class="skill-tag">
                {{ skill }}
              </span>
            </template>
          </template>

          <p class="excerpt">{{ item.excerpt }}</p>

          <template #footer>
            <div class="other-actions">
              <button class="action-btn" @click.stop>
                <span class="text-hide-mobile">{{ item.commentCount || 0 }} 条评论</span>
              </button>
              <button class="action-btn" @click.stop="sharePost">
                <span class="text-hide-mobile">分享招募</span>
              </button>
              <button
                class="action-btn"
                :class="{ 'is-favorite': item.isFavorite }"
                @click.stop="toggleFavorite(item)"
              >
                <span class="text-hide-mobile">{{ item.isFavorite ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </template>
        </FeedCard>

        <!-- 无限滚动指示器 -->
        <div ref="observerTarget" class="infinite-scroll-trigger">
          <div v-if="isLoadingMore" class="loading-state">
            <div class="spinner"></div>
            <span>正在加载更多招募...</span>
          </div>
          <div v-if="!hasMore && !loading" class="end-state">
             🎉 没有更多招募信息了，快去自己发布一个吧！
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.feed-list { 
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-title { 
  font-size: 17px; 
  font-weight: 700; 
  color: var(--color-fg-default); 
  margin: 0 0 10px 0; 
  line-height: 1.4; 
  display: flex; 
  align-items: flex-start; 
  justify-content: space-between;
  gap: 12px; 
}

.status-tag { 
  font-size: 11px; 
  padding: 2px 10px; 
  border-radius: 20px; 
  font-weight: 600; 
  border: 1px solid transparent; 
  flex-shrink: 0;
}
.status-active { 
  background-color: rgba(34, 197, 94, 0.1); 
  color: #22c55e; 
  border-color: rgba(34, 197, 94, 0.2); 
}
.status-full { 
  background-color: var(--color-canvas-subtle); 
  color: var(--color-fg-muted); 
  border-color: var(--color-border-default); 
}

.comp-tag { 
  font-size: 12px; 
  background-color: rgba(245, 158, 11, 0.1); 
  color: #f59e0b; 
  padding: 2px 10px; 
  border-radius: 4px; 
  font-weight: 600; 
  margin-right: 8px;
}
.skill-tag { 
  font-size: 12px; 
  color: var(--color-fg-muted); 
  border: 1px solid var(--color-border-subtle); 
  padding: 2px 10px; 
  border-radius: 4px; 
  background-color: var(--color-canvas-subtle); 
  margin-right: 6px;
}

.excerpt { 
  font-size: 14.5px; 
  color: var(--color-fg-muted); 
  line-height: 1.6; 
  margin: 12px 0;
  display: -webkit-box; 
  -webkit-line-clamp: 3; 
  line-clamp: 3; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.other-actions { 
  display: flex; 
  gap: 16px; 
  margin-top: 8px;
}

.action-btn { 
  background: none;
  border: none;
  color: var(--color-fg-muted); 
  font-size: 13.5px; 
  cursor: pointer; 
  padding: 0;
  transition: all 0.2s ease; 
  font-weight: 500;
}

.action-btn:hover { 
  color: var(--color-accent-fg); 
}

.action-btn.is-favorite { 
  color: #f43f5e; 
}

.infinite-scroll-trigger {
  padding: 32px 0;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-fg-muted);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border-default);
  border-top-color: var(--color-accent-fg);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 12px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.end-state {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
