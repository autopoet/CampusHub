import { ErrorCodes } from './errorCodes';

/**
 * Mock Service – 读取本地 JSON 数据并模拟后端接口
 * @param {string} typeId - 数据种类标识（对应 mock 文件名）
 * @param {object} options - { page, pageSize, filter }
 * @returns {Promise<MockResponse<Array<any>>>}
 */
export async function fetchMockData(typeId, options = { page: 1, pageSize: 20, filter: null }) {
  try {
    const raw = await import(`../mock/${typeId}.json`);
    let list = raw.default || [];

    // 逻辑增强：支持服务端过滤模拟
    if (options.filter) {
      if (typeof options.filter === 'function') {
        // 支持传入过滤函数处理复杂逻辑 (如 OR 匹配)
        list = list.filter(options.filter);
      } else {
        // 支持对象精确匹配
        Object.entries(options.filter).forEach(([key, val]) => {
          list = list.filter(item => item[key] === val);
        });
      }
    }

    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    const pageData = list.slice(start, end);

    return {
      code: ErrorCodes.SUCCESS,
      message: 'OK',
      data: pageData,
      pagination: {
        total: list.length,
        page: options.page,
        pageSize: options.pageSize,
        totalPages: Math.ceil(list.length / options.pageSize),
      },
    };
  } catch (e) {
    console.warn(`[MockService] ${typeId} not found`, e);
    return { 
      code: ErrorCodes.NOT_FOUND, 
      message: '未找到对应的 mock 数据文件', 
      data: null 
    };
  }
}

// 业务专用封装函数
export function getUsers() { return fetchMockData('users'); }
export function getPosts(page, pageSize) { return fetchMockData('posts', { page, pageSize }); }
export function getComments(postId) { return fetchMockData('comments', { filter: { post_id: Number(postId) } }); }
export function getCompetitions(page, pageSize) { return fetchMockData('competitions', { page, pageSize }); }
export function getProducts(page, pageSize) { return fetchMockData('products', { page, pageSize }); }
export function getRecruitments(page, pageSize) { return fetchMockData('recruit', { page, pageSize }); }
export function getNotifications(userId) { return fetchMockData('notifications', { filter: { user_id: Number(userId) } }); }
export function getMessages(userId) { 
  // 复杂过滤：发送者或接收者是当前用户
  return fetchMockData('messages', { 
    filter: (m) => m.sender_id === Number(userId) || m.receiver_id === Number(userId) 
  }); 
}
export function getCategories() { return fetchMockData('categories'); }
export function getTags() { return fetchMockData('tags'); }
export function getSettings() { return fetchMockData('settings'); }
