<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/home/detail/${id}`)
}

// 模拟数据：实际开发中这些会从 API 获取
const list = ref([
  {
    id: 1,
    author: '艾希',
    action: '回答了问题',
    title: 'Vue 3 的 Composition API 相比 Options API 有哪些优势？',
    excerpt: 'Composition API 提供了更好的逻辑复用能力，解决了 Options API 在大型组件中逻辑分散的问题。通过组合函数，我们可以轻松地在不同组件间共享状态逻辑，让代码结构更加清晰。它不仅提升了开发体验，还让大型项目的维护变得不再痛苦。',
    upvoteCount: 1540,
    commentCount: 89,
    updatedTime: '2 小时前',
    isFavorite: false,
    isLiked: false
  },
  {
    id: 2,
    author: '开发者小王',
    action: '赞同了回答',
    title: '如何评价 2024 年的各种前端框架？',
    excerpt: '前端框架的竞争已经进入了下半场，性能不再是唯一指标。现在的开发者更看重 DX（开发体验）、SSR（服务端渲染）的支持程度以及整个生态系统的成熟度。React、Vue 和 Svelte 各有千秋。目前全栈框架如 Next.js 和 Nuxt 正在引领潮流，让前后端边界变得模糊。',
    upvoteCount: 856,
    commentCount: 42,
    updatedTime: '5 小时前',
    isFavorite: false,
    isLiked: false
  },
  {
    id: 3,
    author: '前端精选',
    action: '发布了文章',
    title: '深入浅出 TypeScript 装饰器',
    excerpt: '装饰器是 TS 中一个非常强大的特性，虽然它还处于实验性阶段，但在很多框架（如 Nest.js）中已经被广泛使用。本文将带你从零开始理解装饰器的工作原理及其应用场景。通过实际案例，我们将看到装饰器如何优雅地处理权限校验、日志打印等切面逻辑。',
    upvoteCount: 612,
    commentCount: 15,
    updatedTime: '昨天',
    isFavorite: false,
    isLiked: false
  }
])

// 切换收藏状态
const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
}

// 切换喜欢状态
const toggleLike = (item) => {
  item.isLiked = !item.isLiked
}
</script>

<template>
  <div class="topstory-content">
    <ul class="feed-list">
      <!-- 使用 v-for 循环渲染列表 -->
      <li v-for="item in list" :key="item.id" class="feed-item">

        <!-- 头部：来源与时间 -->
        <div class="feed-source">
          <span class="author-name">{{ item.author }}</span>
          <span class="action-text">{{ item.action }}</span>
          <span class="dot">·</span>
          <span class="time">{{ item.updatedTime }}</span>
        </div>

        <!-- 主体：标题与摘要 -->
        <div class="feed-main" @click="goToDetail(item.id)">
          <h2 class="feed-title">{{ item.title }}</h2>
          <div class="feed-content">
            <p class="excerpt">
              {{ item.excerpt }}
            </p>
          </div>
        </div>

        <!-- 底部：交互操作栏 -->
        <div class="feed-actions">
          <div class="upvote-group">
            <button class="upvote-btn">
              <span class="arrow-up">▲</span>
              赞同 {{ item.upvoteCount }}
            </button>
            <button class="downvote-btn">▼</button>
          </div>

          <div class="other-actions">
            <button class="action-btn" @click.stop>
              <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 5.582 2 10c0 1.81.742 3.477 1.986 4.793-.162 1.353-.87 2.946-1.554 3.753a.5.5 0 0 0 .584.767c1.78-.9 3.864-1.574 5.253-1.895C9.434 17.79 10.686 18 12 18c5.523 0 10-3.582 10-8s-4.477-8-10-8Z"/></svg>
              {{ item.commentCount }} 条评论
            </button>
            <button class="action-btn" @click.stop>
              <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 5l-1.42 1.42L16.16 8H9a5 5 0 0 0 0 10h2v-2H9a3 3 0 0 1 0-6h7.16l-1.58 1.58L16 13l4-4-4-4z"/></svg>
              分享
            </button>
            <button
              class="action-btn"
              :class="{ 'is-favorite': item.isFavorite }"
              @click.stop="toggleFavorite(item)"
            >
              <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {{ item.isFavorite ? '已收藏' : '收藏' }}
            </button>
            <button
              class="action-btn"
              :class="{ 'is-liked': item.isLiked }"
              @click.stop="toggleLike(item)"
            >
              <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              {{ item.isLiked ? '已喜欢' : '喜欢' }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 列表容器 */
.feed-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feed-item {
  padding: 20px 0;
  border-bottom: 1px solid #f0f2f7;
  transition: background-color 0.2s;
}

.feed-item:last-child {
  border-bottom: none;
}

/* 顶部信息流来源 */
.feed-source {
  font-size: 14px;
  color: #8590a6;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-weight: 600;
  color: #444;
}

.dot {
  margin: 0 4px;
}

/* 标题样式 */
.feed-title {
  font-size: 18px;
  font-weight: 600;
  color: #121212;
  margin: 0 0 10px 0;
  line-height: 1.6;
  cursor: pointer;
}

.feed-title:hover {
  color: #1751d0;
}

.feed-main:hover .excerpt {
  color: #1a1a1a;
}

/* 摘要内容 */
.excerpt {
  font-size: 15px;
  color: #444;
  line-height: 1.67;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more {
  color: #1751d0;
  margin-left: 4px;
  display: inline-block;
}

.read-more:hover {
  color: #8590a6;
}

/* 操作按钮区域 */
.feed-actions {
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 20px;
}

.upvote-group {
  display: flex;
  gap: 4px;
}

.upvote-btn {
  background: rgba(0, 102, 255, 0.1);
  color: #0066ff;
  border: none;
  padding: 8px 12px;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.upvote-btn:hover {
  background: rgba(0, 102, 255, 0.15);
}

.downvote-btn {
  background: rgba(0, 102, 255, 0.1);
  color: #0066ff;
  border: none;
  padding: 8px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.downvote-btn:hover {
  background: rgba(0, 102, 255, 0.15);
}

/* 辅助按钮（评论、分享等） */
.other-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: #8590a6;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn:hover {
  color: #76839b;
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 收藏激活状态 */
.action-btn.is-favorite {
  color: #f7ba2a; /* 亮黄色 */
  font-weight: 600;
}

/* 喜欢激活状态 */
.action-btn.is-liked {
  color: #f56c6c; /* 亮红色 */
  font-weight: 600;
}

/* 点击时的缩放效果 */
.action-btn:active {
  transform: scale(0.9);
}
</style>

