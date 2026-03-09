<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 模拟的详情数据 (实际开发中会根据路由参数 ID 从 API 获取)
const detailData = {
  title: 'Vue 3 的 Composition API 相比 Options API 有哪些优势？',
  author: '艾希',
  updatedTime: '2 小时前',
  content: `
    <p>Composition API 是 Vue 3 的核心特性之一。它的出现主要是为了解决 Options API 在大型组件开发中的痛点。</p>
    <h3>1. 逻辑复用更简单</h3>
    <p>在 Options API 中，我们通常使用 mixins 来复用逻辑，但 mixins 存在命名冲突和来源不明的问题。Composition API 通过组合函数（Composables）让代码逻辑的拆解和复用变得非常直观。</p>
    <h3>2. 更好的代码组织</h3>
    <p>在一个大型组件里，属于同一个功能的代码（如搜索、分页）往往被拆散在 data、methods、computed 中。Composition API 允许你按功能组织代码，将相关的逻辑放在一起。</p>
    <h3>3. 更完美的 TypeScript 支持</h3>
    <p>由于 Composition API 主要是基于变量和函数的，这使得它对 TS 的类型推导极其友好，不再需要像 Options API 那样使用复杂的 this 类型标注。</p>
  `,
  upvoteCount: 1540,
  commentCount: 89
}
</script>

<template>
  <div class="detail-container">
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" class="icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        返回
      </button>
    </header>

    <main class="detail-main">
      <h1 class="detail-title">{{ detailData.title }}</h1>

      <div class="author-info">
        <div class="avatar"></div>
        <div class="meta">
          <span class="author-name">{{ detailData.author }}</span>
          <span class="time">发布于 {{ detailData.updatedTime }}</span>
        </div>
      </div>

      <div class="content markdownStyle" v-html="detailData.content"></div>

      <footer class="detail-footer">
        <div class="actions">
          <button class="upvote-btn">赞同 {{ detailData.upvoteCount }}</button>
          <button class="action-btn">💬 {{ detailData.commentCount }} 条评论</button>
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
}

.detail-header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebebeb;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: none;
  color: #8590a6;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  color: #1751d0;
}

.icon {
  width: 20px;
  height: 20px;
}

.detail-main {
  padding: 40px 20px;
}

.detail-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.4;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.avatar {
  width: 38px;
  height: 38px;
  background: #eee;
  border-radius: 2px;
}

.author-name {
  font-weight: 600;
  display: block;
}

.time {
  font-size: 14px;
  color: #8590a6;
}

.content {
  line-height: 1.8;
  color: #1a1a1a;
  font-size: 16px;
}

/* 深度选择器强制修改 v-html 内部样式 */
:deep(h3) {
  margin: 1.5em 0 0.5em;
  font-size: 20px;
}

:deep(p) {
  margin-bottom: 1.2em;
}

.detail-footer {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #ebebeb;
}

.upvote-btn {
  background: rgba(0, 102, 255, 0.1);
  color: #0066ff;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: #8590a6;
  cursor: pointer;
}
</style>
