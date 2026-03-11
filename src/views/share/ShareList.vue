<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '@/components/ui/FeedCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'

const router = useRouter()
const loading = ref(true)

const goToDetail = (id) => {
  router.push(`/home/detail/${id}`)
}

const list = ref([])

onMounted(() => {
  setTimeout(() => {
    // 干货分享专属数据
    list.value = [
      {
        id: 2,
        type: 'share',
        author: '架构师老张',
        action: '分享了比赛经验贴',
        title: '计算机设计大赛国一经验贴：如何写好一份漂亮的答辩PPT？',
        excerpt: '很多人代码写得好，但是在计设答辩环节吃了大亏。答辩只有不到10分钟，评委根本没时间看你的每一行代码。你需要在一开始就抛出项目解决的市场痛点、商业价值，然后用架构图展示技术难点。本文分享了我们队伍去年拿国一使用的PPT模板与演讲逐字稿...',
        competition: '计算机设计大赛',
        tags: ['答辩技巧', 'PPT模板', '干货分享'],
        commentCount: 120,
        updatedTime: '5 小时前',
        isFavorite: false,
      }
    ]
    loading.value = false
  }, 1000)
})

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
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
          @click="goToDetail(item.id)"
        >
          <template #title>
            <h2 class="feed-title">{{ item.title }}</h2>
          </template>
          
          <template #tags>
            <span class="comp-tag" v-if="item.competition">{{ item.competition }}</span>
            <span v-for="(tag, index) in item.tags" :key="index" class="info-tag">
              {{ tag }}
            </span>
          </template>

          <p class="excerpt">{{ item.excerpt }}</p>

          <template #footer>
            <div class="other-actions">
              <button class="action-btn" @click.stop>
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 5.582 2 10c0 1.81.742 3.477 1.986 4.793-.162 1.353-.87 2.946-1.554 3.753a.5.5 0 0 0 .584.767c1.78-.9 3.864-1.574 5.253-1.895C9.434 17.79 10.686 18 12 18c5.523 0 10-3.582 10-8s-4.477-8-10-8Z"/></svg>
                <span class="text-hide-mobile">{{ item.commentCount }} 条评论</span>
              </button>
              <button class="action-btn" @click.stop>
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 5l-1.42 1.42L16.16 8H9a5 5 0 0 0 0 10h2v-2H9a3 3 0 0 1 0-6h7.16l-1.58 1.58L16 13l4-4-4-4z"/></svg>
                <span class="text-hide-mobile">分享</span>
              </button>
              <button
                class="action-btn"
                :class="{ 'is-favorite': item.isFavorite }"
                @click.stop="toggleFavorite(item)"
              >
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span class="text-hide-mobile">{{ item.isFavorite ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </template>
        </FeedCard>
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

.feed-title { font-size: 16px; font-weight: 600; color: var(--color-fg-default); margin: 0 0 8px 0; line-height: 1.5; }

.comp-tag { 
  font-size: 11px; 
  background-color: var(--color-attention-subtle, rgba(212, 167, 44, 0.1)); 
  color: var(--color-attention-fg, #9a6700); 
  padding: 2px 8px; 
  border-radius: 12px; 
  font-weight: 500; 
  border: 1px solid var(--color-attention-muted, rgba(212, 167, 44, 0.4)); 
}
[data-theme='dark'] .comp-tag { background-color: rgba(212, 167, 44, 0.15); color: #d4a72c; }

.info-tag { font-size: 12px; color: var(--color-fg-muted); border: 1px solid var(--color-border-default); padding: 1px 8px; border-radius: 12px; background-color: var(--color-canvas-subtle); }

.excerpt { font-size: 14px; color: var(--color-fg-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px;}

.other-actions { display: flex; gap: 12px; }

.action-btn { 
  background: var(--color-canvas-subtle); 
  border: 1px solid var(--color-border-default);
  color: var(--color-fg-muted); 
  font-size: 12px; 
  cursor: pointer; 
  padding: 6px 12px; 
  border-radius: 8px;
  transition: all 0.2s ease; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  flex: 1;
  justify-content: center;
}

.action-btn:hover { 
  color: var(--color-accent-fg); 
  background: var(--color-canvas-overlay);
  border-color: var(--color-accent-fg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.btn-icon { width: 14px; height: 14px; flex-shrink: 0; }
.action-btn.is-favorite { color: var(--color-danger-fg, #cf222e); }
.action-btn:active { transform: scale(0.95); }

@media screen and (max-width: 768px) {
  .feed-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .feed-title { font-size: 16px; margin-bottom: 8px; line-height: 1.5; }
  .excerpt { -webkit-line-clamp: 4; line-clamp: 4; }
  .action-btn span.text-hide-mobile { display: none; }
}
</style>
