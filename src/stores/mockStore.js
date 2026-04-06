import { defineStore } from 'pinia';
import { fetchMockData } from '@/api/mockService';
import { ErrorCodes } from '@/api/errorCodes';

/**
 * 全局 Mock Store – 统一管理所有模拟数据
 */
export const useMockStore = defineStore('mock', {
  state: () => ({
    users: [],
    shares: [], // share 类型（原 posts）
    comments: [],
    competitions: [],
    products: [],
    notifications: [],
    messages: [],
    categories: [],
    tags: [],
    settings: {},
    recruitments: [], // recruit 类型

    // 分页状态追踪
    pagination: {
      shares: { page: 1, pageSize: 20, total: 0 },
      competitions: { page: 1, pageSize: 12, total: 0 },
      products: { page: 1, pageSize: 20, total: 0 },
      recruitments: { page: 1, pageSize: 8, total: 0 },
      messages: { page: 1, pageSize: 50, total: 0 },
    },

    loading: {},
    error: {},
  }),

  actions: {
    /** 通用加载器 */
    async _load(typeId, storeKey, opts = { page: 1, pageSize: 20, filter: null, append: false }) {
      this.loading[storeKey] = true;
      try {
        const resp = await fetchMockData(typeId, opts);
        if (resp.code === ErrorCodes.SUCCESS) {
          if (opts.append) {
            this[storeKey] = [...this[storeKey], ...resp.data];
          } else {
            this[storeKey] = resp.data;
          }
          if (resp.pagination && this.pagination[storeKey]) {
            this.pagination[storeKey] = resp.pagination;
          }
          this.error[storeKey] = null;
          return resp.data;
        } else {
          this.error[storeKey] = resp.message;
          return null;
        }
      } finally {
        this.loading[storeKey] = false;
      }
    },

    // --- 业务加载方法 ---
    loadUsers() { return this._load('users', 'users'); },
    loadShares(page = 1, append = false) { return this._load('shares', 'shares', { page, pageSize: 20, append }); },
    async loadShareById(id) {
      const share = this.shares.find(p => p.id === Number(id));
      if (share) return share;
      const resp = await fetchMockData('shares', { filter: { id: Number(id) } });
      if (resp.code === ErrorCodes.SUCCESS) return resp.data[0] || null;
      return null;
    },
    async loadComments(postId) { return this._load('comments', 'comments', { page: 1, pageSize: 50, filter: { post_id: Number(postId) } }); },
    loadCompetitions(page = 1, append = false) { return this._load('competitions', 'competitions', { page, pageSize: 12, append }); },
    loadProducts(page = 1, append = false) { return this._load('products', 'products', { page, pageSize: 20, append }); },
    loadRecruitments(page = 1, append = false) { return this._load('recruit', 'recruitments', { page, pageSize: 8, append }); },
    async loadRecruitmentById(id) {
      const rec = this.recruitments.find(r => r.id === Number(id));
      if (rec) return rec;
      const resp = await fetchMockData('recruit', { filter: { id: Number(id) } });
      if (resp.code === ErrorCodes.SUCCESS) return resp.data[0] || null;
      return null;
    },
    async loadNotifications(userId) { return this._load('notifications', 'notifications', { page: 1, pageSize: 20, filter: { user_id: Number(userId) } }); },
    async loadMessages(userId) { return this._load('messages', 'messages', { page: 1, pageSize: 50, filter: (m) => m.sender_id === Number(userId) || m.receiver_id === Number(userId) }); },
    loadCategories() { return this._load('categories', 'categories'); },
    loadTags() { return this._load('tags', 'tags'); },
    async loadSettings() { const resp = await fetchMockData('settings'); if (resp.code === ErrorCodes.SUCCESS) { this.settings = resp.data[0] || {}; } },
    clearStore() { this.$reset(); }
  }
});
