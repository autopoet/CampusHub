import { defineStore } from 'pinia';
import { fetchMockData } from '@/api/mockService';
import { ErrorCodes } from '@/api/errorCodes';

/**
 * 全局 Mock Store – 统一管理所有模拟数据
 */
export const useMockStore = defineStore('mock', {
  state: () => ({
    users: [],
    posts: [],
    comments: [],
    competitions: [],
    products: [],
    notifications: [],
    messages: [],
    categories: [],
    tags: [],
    settings: {}, // 应该是个对象
    recruitments: [],
    
    // 分页状态追踪
    pagination: {
      posts: { page: 1, pageSize: 20, total: 0 },
      competitions: { page: 1, pageSize: 12, total: 0 },
      products: { page: 1, pageSize: 20, total: 0 },
      recruitments: { page: 1, pageSize: 10, total: 0 },
    },
    
    loading: {},
    error: {},
  }),

  actions: {
    /**
     * 通用加载器，支持追加与单次加载
     * @param {string} typeId - mock文件名
     * @param {string} storeKey - state中的键名
     * @param {object} opts - { page, pageSize, filter, append }
     */
    async _load(typeId, storeKey, opts = { page: 1, pageSize: 20, filter: null, append: false }) {
      this.loading[storeKey] = true;
      const resp = await fetchMockData(typeId, opts);
      
      if (resp.code === ErrorCodes.SUCCESS) {
        // 如果是追加模式（无限滚动），合并数组；否则直接替换
        if (opts.append) {
          this[storeKey] = [...this[storeKey], ...resp.data];
        } else {
          this[storeKey] = resp.data;
        }

        // 更新分页元数据
        if (resp.pagination && this.pagination[storeKey]) {
          this.pagination[storeKey] = resp.pagination;
        }
        
        this.error[storeKey] = null;
        return resp.data;
      } else {
        this.error[storeKey] = resp.message;
        return null;
      } finally {
        this.loading[storeKey] = false;
      }
    },

    // --- 业务方法 ---

    loadUsers() { return this._load('users', 'users'); },
    
    loadPosts(page = 1, append = false) { 
      return this._load('posts', 'posts', { page, pageSize: 20, append }); 
    },

    async loadComments(postId) {
      // 这里的 logic 不再破坏全局 comments 状态，而是加载对应的帖子评论
      // 为了性能，如果切换帖子，我们通常重置 comments
      // 合并默认分页参数，避免 pageSize 为 undefined
      return this._load('comments', 'comments', { page: 1, pageSize: 20, filter: { post_id: Number(postId) } });
    },

    async loadPostById(id) {
      // 逻辑补齐：如果 state 中已经有了，直接找，不发起请求
      const post = this.posts.find(p => p.id === Number(id));
      if (post) return post;
      
      // 如果没有，加载全量列表（实际应有后端 getById API，目前模拟加载并查找单条）
      const list = await fetchMockData('posts');
      if (list.code === ErrorCodes.SUCCESS) {
         const found = list.data.find(p => p.id === Number(id));
         if (found) return found;
      }
      return null;
    },

    loadCompetitions(page = 1, append = false) {
      return this._load('competitions', 'competitions', { page, pageSize: 12, append });
    },

    loadProducts(page = 1, append = false) {
      return this._load('products', 'products', { page, pageSize: 20, append });
    },

    loadRecruitments(page = 1, append = false) {
      return this._load('recruit', 'recruitments', { page, pageSize: 8, append });
    },

    async loadNotifications(userId) {
      // 合并默认分页参数，避免 pageSize 为 undefined
      return this._load('notifications', 'notifications', { page: 1, pageSize: 20, filter: { user_id: Number(userId) } });
    },

    loadCategories() { return this._load('categories', 'categories'); },
    loadTags() { return this._load('tags', 'tags'); },

    async loadSettings() {
      const resp = await fetchMockData('settings');
      if (resp.code === ErrorCodes.SUCCESS) {
        // 修正逻辑：提取数组中的第0个对象赋给 settings
        this.settings = resp.data[0] || {};
      }
    },

    // 辅助：获取已加载内容的计数
    getLoadedCount(storeKey) {
      return this[storeKey]?.length || 0;
    },

    clearStore() {
      this.$reset(); // 使用 Pinia 原生的 reset 保持统一
    }
  }
});
