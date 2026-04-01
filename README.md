<p align="center">
  <img src="./src/assets/logo.svg" width="128" height="128" alt="CampusHub Logo" />
</p>

<h1 align="center">CampusHub 竞赛组队平台</h1>

<p align="center">
  <strong>基于 Vue 3 构建的竞赛组队与协作平台</strong>
</p>

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js" alt="Vue 3" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite" alt="Vite" />
  </a>
  <a href="https://pinia.vuejs.org/">
    <img src="https://img.shields.io/badge/Pinia-Latest-ffe467?style=flat-square&logo=pinia" alt="Pinia" />
  </a>
</p>

---

## 为什么发起这个项目？

CampusHub 旨在建立一个去中心化的技术爱好者集结地。通过数字化的实力展示与透明的组队机制，它打破了传统贴吧、群聊等低效的信息分发模式。我希望通过这个平台，让每一次竞赛组队不再是低效率的“随机抽样”，而是基于技术深度与互补性的精准碰撞。

## 核心技术亮点

本项目包含动态看板与热力图模块，针对前端海量数据下的渲染帧率与 SPA 路由状态同步进行了专项性能调优与实践。

### 1. 基于 Web Worker 的长任务分离优化
针对大规模热力图数据解析引发的主线程阻塞（Long Task）痛点，引入 `Web Worker` 构建异步计算层，将密集型计算任务从渲染主线程中剥离。结合 Event Loop 机制实施异步分发，有效解决了页面卡顿问题，保障了 UI 层交互帧率的高效稳定。

### 2. 基于 GPU 加速的轻量级布局实践
弃用繁冗的第三方 UI 库，利用原生 `CSS Grid` 范式手写实现自适应瀑布流布局，显著降低了包体积负担。在玻璃拟态动效中严格约束 `transform` 与 `opacity` 的使用以建立 **GPU 合成层 (Composite Layer)**，从底层规避了大量的重排（Reflow）与重绘（Repaint）。

### 3. 基于路由与状态机的 SPA 数据隔离拦截
针对单页应用中高频发生的动态路由实例**就地复用（Patch）**导致的状态污染漏洞，联动 **Vue Router 全局守卫** 与 **Pinia** 响应式缓存池进行强制状态重置。通过设计模块 ID 隔离映射策略，从路由级别斩断了跨页面切换时的数据碰撞隐患。

## 技术栈

* **核心框架**: Vue 3.5 (Composition API)
* **构建工具**: Vite 6.0 + pnpm
* **状态管理**: Pinia (全链路状态流转)
* **性能方案**: Web Workers API + GPU 硬件加速
* **响应式布局**: CSS Grid + CSS Variables

## 项目结构

```bash
├── src/
│   ├── api/            # 接口请求封装
│   ├── assets/         # 静态资源与样式变量
│   ├── components/     # 核心 UI 组件
│   ├── layouts/        # 容器布局
│   ├── stores/         # Pinia 状态管理
│   ├── views/          # 业务逻辑页面
│   └── workers/        # 异步计算 Worker 逻辑
├── public/             # 静态公共资源
└── package.json        # 项目依赖配置
```

## 快速开始

```bash
# 1. 获取代码
git clone https://github.com/autopoet/campushub.git

# 2. 安装依赖
pnpm install

# 3. 本地开发预览
pnpm dev

# 4. 生产环境构建
pnpm build
```

---

<p align="center">
  期待与每一个优秀的你在代码的世界相遇。
</p>
