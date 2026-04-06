# Design Overview – CampusHub Mock Data Architecture Upgrade

## 目标
- **解耦业务逻辑与数据**：所有业务数据统一存放在 `src/mock/` 目录下的 JSON 文件。
- **统一后端模拟层**：`src/api/mockService.js` 负责读取本地 JSON、支持分页、过滤以及统一错误码。
- **全局状态管理**：使用 **Pinia** (`src/stores/mockStore.js`) 统一管理所有数据、加载状态、分页信息以及错误处理。
- **组件层仅负责渲染**：页面组件（如 `HomeView.vue`、`RecruitList.vue`、`PostDetail.vue`）不再直接读取本地文件，而是通过 Store 调用统一的 API。
- **为后端对接做好准备**：只需在 `mockService.js` 替换为真实 `axios`/`fetch` 请求，业务层代码保持不变。

## 关键实现
### 1. Mock Service (`src/api/mockService.js`)
- `fetchMockData(typeId, {page, pageSize, filter, append})`
  - 动态 `import` 对应的 JSON 文件。
  - 支持 **过滤**（如 `post_id`、`user_id`）和 **分页**。
  - 返回统一结构 `{ code, message, data, pagination }`，使用 `errorCodes.js` 中的常量。
- 为每种业务提供专用函数（`getPosts`, `getComments`, `getRecruitments` 等），简化调用。

### 2. Pinia Store (`src/stores/mockStore.js`)
- **状态**：`users, posts, comments, competitions, products, notifications, messages, categories, tags, settings, recruitments`。
- **分页元数据**：`pagination` 对象记录每类数据的 `page、pageSize、total、totalPages`。
- **通用加载器 `_load`**：
  - 支持 **追加模式**（`append: true`）用于无限滚动。
  - 自动更新 `loading`、`error`、`pagination`。
- **业务方法**：`loadPosts`, `loadComments(postId)`, `loadRecruitments(page, append)`, `loadPostById(id)` 等。
- **设置处理**：`loadSettings` 自动把数组的第一个对象解包为对象。
- **清理**：`clearStore` 使用 Pinia `$reset`，保持状态可复位。

### 3. 页面组件改造
| 页面 | 关键改动 |
|------|----------|
| **HomeView.vue** | `onMounted` 调用 `store.loadPosts()`、`store.loadCompetitions()` 等，渲染数据直接来自 Store。 |
| **RecruitList.vue** | 使用 `store.recruitments`，分页通过 `store.loadRecruitments(page, true)` 实现无限滚动。 |
| **PostDetail.vue** | 移除硬编码 `mockDb`，改为 `store.loadPostById(id)` 与 `store.loadComments(id)`，评论区使用 `store.comments`。 |

### 4. Mock 数据 (`src/mock/`)
- 每类数据对应一个 JSON 文件，统一包含 `type_id` 字段以标识数据种类。
- 示例：`posts.json`、`recruit.json`、`comments.json`、`settings.json` 等。
- 通过 `fetchMockData` 的 `filter` 参数实现类似后端的查询（如 `post_id` 过滤评论）。

## 未来对接真实后端的步骤
1. **替换 `mockService.js`**：改为使用 `axios` 调用真实 API，保持返回结构不变。
2. **后端分页/过滤**：后端实现 `page`、`pageSize`、`filter` 参数，前端代码无需改动。
3. **认证与权限**：在 `router/index.js` 中将占位的 `fake-jwt-token` 替换为真实的 `authStore` token。
4. **类型安全**（可选）：引入 TypeScript，为每类 Mock 数据定义接口。

## 视觉与交互提升（已实现）
- 采用 **Glassmorphism**、渐变、微动画（收藏、加载）提升用户体验。
- 统一使用 **Google Fonts – Inter**，暗色模式自适应。
- 组件内部使用 **SkeletonCard**、**Spinner** 提示加载状态。

---
> 此文档位于项目根目录 `DESIGN_OVERVIEW.md`，便于团队成员快速了解当前架构与后续迁移路径。
