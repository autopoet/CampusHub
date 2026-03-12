#  CampusHub

<p align="center">
  <img src="./src/assets/logo.svg" width="120" height="120" alt="CampusHub Logo" />
</p>

<p align="center">
  <strong>面向高校学子的竞赛组队与经验分享一站式平台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Pinia-3.x-ffe467?style=flat-square&logo=pinia" alt="Pinia" />
  <img src="https://img.shields.io/badge/Element_Plus-2.x-409eff?style=flat-square&logo=element-plus" alt="Element Plus" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

##  项目简介

**CampusHub** 是一个专注于高校学生**竞赛社交**的极客平台。旨在打破校园内的“信息孤岛”，通过连接跨学科的优秀学子，解决竞赛组队难、经验沉淀少、信息不对称等痛点。无论是寻找ACM的队友，还是分享大创的实战经验，CampusHub 都是你的最佳选择。

##  核心特性

- **竞赛大厅**：实时同步各类校级、省市级及国家级竞赛信息，支持日历视图精准掌握关键时间节点。
- **招募大厅**：智能匹配算法（开发中），支持按技术栈、获奖经历发布组队集结信号。
- **干货分享**：极致的 Markdown 阅读体验，沉淀金奖选手的实战笔记与技术方案。
- **极客档案**：多维度能力雷达图，通过 GitHub 风格的热力图记录你的竞赛活跃矩阵。
- **极致动效**：原生支持全系统暗黑模式平滑切换，玻璃拟态 UI 设计，极致的视觉交互体验。

##  技术架构

项目基于现代前端工程化最佳实践构建：

| 维度 | 技术选型 |
| --- | --- |
| **基础框架** | [Vue 3](https://vuejs.org/) (Composition API) |
| **构建工具** | [Vite](https://vitejs.dev/) |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) |
| **UI 组件库** | [Element Plus](https://element-plus.org/) |
| **数据可视化** | [ECharts 6](https://echarts.apache.org/) |
| **多线程处理** | Web Workers (Offscreen Computing) |
| **样式方案** | Modern CSS + CSS Variables (Design Tokens) |

##  项目预览

*(此处建议上传项目运行截图，如首页、个人档案、竞赛列表等)*

##  快速开始

### 环境依赖
- Node.js >= 20.x
- pnpm / npm / yarn

### 安装
```bash
git clone https://github.com/your-username/campushub.git
cd campushub
npm install
```

### 启动
```bash
npm run dev
```

### 打包
```bash
npm run build
```

##  项目结构

```text
src/
├── assets/         # 静态资源与全局样式 Token
├── components/     # 高复用业务组件
│   ├── layout/     # 全局布局容器
│   └── ui/         # 通用交互组件（如 Cmd+K 搜索框）
├── router/         # 嵌套路由与导航守卫
├── stores/         # 基于 Pinia 的状态管理
├── views/          # 页面级组件
├── workers/        # 耗时任务独立线程
└── main.js         # 项目入口
```

##  贡献指南

我们欢迎任何形式的贡献！无论是提交 Bug 反馈，还是提供新的 Feature 建议。

##  开源协议

本项目基于 [MIT](LICENSE) 协议开源。
