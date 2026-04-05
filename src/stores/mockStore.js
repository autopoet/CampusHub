import { defineStore } from 'pinia';
import { fetchMockData } from '@/api/mockService';

/**
 * 全局 Mock Store – 统一管理所有模拟数据
 * 使用统一的 _load 方法处理分页、错误、加载状态
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
    settings: {},
    // 分页信息
    pagination: {
      posts: { page: 1, pageSize: 20, total: 0 },
      competitions: { page: 1, pageSize: 10, total: 0 },
      products: { page: 1, pageSize: 20, total: 0 },
    },
    loading: {},
    error: {},
  }),

  actions: {
    /** 通用加载器 */
    async _load(typeId, storeKey, opts = { page: 1, pageSize: 20 }) {
      this.loading[storeKey] = true;
      const resp = await fetchMockData(typeId, opts);
      if (resp.code === 0) {
        this[storeKey] = resp.data;
        if (resp.pagination) this.pagination[storeKey] = resp.pagination;
        this.error[storeKey] = null;
      } else {
        this.error[storeKey] = resp.message;
      }
      this.loading[storeKey] = false;
    },

    // 业务专用加载函数
    loadUsers() { return this._load('users', 'users'); },
    loadPosts(page = 1, pageSize = 20) { return this._load('posts', 'posts', { page, pageSize }); },
    async loadComments(postId) {
      await this._load('comments', 'comments');
      this.comments = this.comments.filter(c => c.post_id === postId);
    },
    loadCompetitions(page = 1, pageSize = 10) { return this._load('competitions', 'competitions', { page, pageSize }); },
    loadProducts(page = 1, pageSize = 20) { return this._load('products', 'products', { page, pageSize }); },
    async loadNotifications(userId) {
      await this._load('notifications', 'notifications');
      this.notifications = this.notifications.filter(n => n.user_id === userId);
    },
    async loadMessages(userId) {
      await this._load('messages', 'messages');
      this.messages = this.messages.filter(m => m.sender_id === userId || m.receiver_id === userId);
    },
    loadCategories() { return this._load('categories', 'categories'); },
    loadTags() { return this._load('tags', 'tags'); },
    loadSettings() { return this._load('settings', 'settings'); },

    clearStore() {
      Object.keys(this.$state).forEach(k => {
        if (Array.isArray(this[k])) this[k] = [];
        else if (typeof this[k] === 'object') this[k] = {};
      });
    },
  },
});
