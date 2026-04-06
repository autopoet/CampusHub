# Design Overview – CampusHub Mock Data Architecture Upgrade

## 目标
- **解耦业务逻辑与数据**：所有业务数据统一存放在 `src/mock/` 目录下的 JSON 文件。
- **统一后端模拟层**：`src/api/mockService.js` 负责读取本地 JSON、支持分页、高级过滤以及统一错误码。
- **全局状态管理**：使用 **Pinia** (`src/stores/mockStore.js`) 统一管理所有数据、加载状态、分页信息以及错误处理。
- **组件层仅负责渲染**：页面组件不再直接读取本地文件，而是通过 Store 调用统一的 API。
- **为后端对接做好准备**：只需在 `mockService.js` 替换为真实请求，业务层代码无需改动。

## 关键实现
### 1. Mock 引擎增强 (`src/api/mockService.js`)
- **高级过滤支持**：`filter` 参数现已支持 **对象精确匹配** 和 **自定义布尔函数**。可处理复杂逻辑（如私信中匹配 `sender_id` 或 `receiver_id`）。
- **标准响应格式**：返回统一结构 `{ code, message, data, pagination }`。
- **错误码集成**：引入 `errorCodes.js`（SUCCESS=0, NOT_FOUND=2 等），模拟真实后端返回。

### 2. Pinia 全局状态 (`src/stores/mockStore.js`)
- **健壮的加载器 `_load`**：
  - 采用 `try...finally` 结构，确保 `loading` 状态在请求结束后准确关闭。
  - 支持 **追加模式** (`append: true`)，无缝适配“无限滚动”业务。
- **逻辑闭环**：添加了 `loadNotifications`、`loadMessages` 等业务 Action，彻底告别组件内部硬编码。
- **自动化清理**：提供 `clearStore` 方法（调用 `$reset`），用于用户登出时清空内存敏感数据。

### 3. 认证与安全流 (`router/index.js` & `LoginView.vue`)
- **登录交互**：`LoginView.vue` 已支持 **键盘回车键登录**（Enter key），提升极客用户的操作效率。
- **凭证同步**：登录成功后，Token (`campus_token`) 会持久化到 `localStorage`。
- **守卫拦截**：路由守卫 (`beforeEach`) 动态检查 `localStorage` 中的凭证，未登录用户访问受限页面将精准重定向。
- **退出闭环**：退出登录时，系统会自动 **移除 Token** 并 **重置 Pinia 状态**，防止数据泄露。

### 4. 页面组件深度改造
| 页面 / 组件 | 关键改动说明 |
|------|----------|
| **HomeView.vue** | 初始挂载时批量调用 Store 方法，填充首页骨架屏。 |
| **RecruitList.vue** | 完全对接 Store 状态。无限滚动逻辑由 `loadRecruitments(page, true)` 驱动。 |
| **PostDetail.vue** | 移除数百行硬编码 `mockDb`。评论区 (`store.comments`) 与内容详情同步按需加载。 |
| **HeaderUserInfo.vue** | 顶栏红点与通知列表已连通全局 Store，反映真实（模拟）未读状态。 |

### 5. Mock 数据管理 (`src/mock/`)
- 每个文件包含 `type_id` 字段。
- 支持按 ID 快速查找，支持父子层级数据模拟（如帖子对应的评论）。

## 未来对接真实后端的步骤
1. **替换 API 实现**：在 `mockService.js` 中将本地 `import()` 替换为 `axios` 调用。
2. **后端分页适配**：后端实现对应的 `page`、`filter` 逻辑，前端无需修改。
3. **真实鉴权**：将 `fake-jwt-token` 替换为后端下发的真实 JWT。

## 视觉与交互规范
- **风格**：全站沉浸式暗色模式/亮色模式自适应，采用 Glassmorphism 毛玻璃质感。
- **UX反馈**：所有数据加载均配备 SkeletonCard 或微动效 Spinner。
- **交互微动效**：按钮悬浮、路由切换、收藏操作均包含平滑过渡与反馈。

---
> 此文档位于项目根目录 `DESIGN_OVERVIEW.md`，是前后端交接及新成员加入时的核心技术文档。
