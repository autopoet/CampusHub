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

    // 逻辑增强：支持服务端过滤模拟 (例如 filter: { post_id: 101 })
    if (options.filter) {
      const filterKey = Object.keys(options.filter)[0];
      const filterVal = options.filter[filterKey];
      list = list.filter(item => item[filterKey] === filterVal);
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
export function getComments(postId) { return fetchMockData('comments', { filter: { post_id: postId } }); }
export function getCompetitions(page, pageSize) { return fetchMockData('competitions', { page, pageSize }); }
export function getProducts(page, pageSize) { return fetchMockData('products', { page, pageSize }); }
export function getRecruitments(page, pageSize) { return fetchMockData('recruit', { page, pageSize }); }
export function getNotifications(userId) { return fetchMockData('notifications', { filter: { user_id: userId } }); }
export function getMessages(userId) { return fetchMockData('messages', { filter: { user_id: userId } }); }
export function getCategories() { return fetchMockData('categories'); }
export function getTags() { return fetchMockData('tags'); }
export function getSettings() { return fetchMockData('settings'); }
