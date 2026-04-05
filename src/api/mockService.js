/**
 * Mock Service – 读取本地 JSON 数据并模拟后端接口
 * @param {string} typeId - 数据种类标识（对应 mock 文件名）
 * @param {object} options - { page, pageSize }
 * @returns {Promise<MockResponse<Array<any>>>}
 */
export async function fetchMockData(typeId, options = { page: 1, pageSize: 20 }) {
  try {
    const raw = await import(`../mock/${typeId}.json`);
    const list = raw.default || [];
    const start = (options.page - 1) * options.pageSize;
    const end = start + options.pageSize;
    const pageData = list.slice(start, end);
    return {
      code: 0,
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
    console.warn(`[MockService] ${typeId} not found`);
    return { code: 2, message: '未找到对应的 mock 数据文件', data: null };
  }
}

// 业务专用封装函数
export function getUsers() { return fetchMockData('users'); }
export function getPosts() { return fetchMockData('posts'); }
export function getComments() { return fetchMockData('comments'); }
export function getCompetitions() { return fetchMockData('competitions'); }
export function getProducts() { return fetchMockData('products'); }
export function getNotifications() { return fetchMockData('notifications'); }
export function getMessages() { return fetchMockData('messages'); }
export function getCategories() { return fetchMockData('categories'); }
export function getTags() { return fetchMockData('tags'); }
export function getSettings() { return fetchMockData('settings'); }
