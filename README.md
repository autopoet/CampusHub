<p align="center">
  <img src="./src/assets/logo.svg" width="128" height="128" alt="CampusHub Logo" />
</p>

<h1 align="center">CampusHub</h1>

<p align="center">
  <strong>面向高校学子的竞赛组队与经验分享一站式极客平台</strong>
</p>

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Vue-3.5+-42b883?style=for-the-badge&logo=vue.js" alt="Vue 3" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-6.x-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  </a>
  <a href="https://pinia.vuejs.org/">
    <img src="https://img.shields.io/badge/Pinia-Latest-ffe467?style=for-the-badge&logo=pinia" alt="Pinia" />
  </a>
</p>

---

## 为什么发起这个项目？

在大学期间，我们常面临“信息不对称”的尴尬：你是写代码的顶级 Hacker，却找不到能把 PPT 讲出花的队友；你有满脑子的竞赛经验，却只能在过时的贴吧或零散的群聊里沉没。

**CampusHub** 的诞生就是为了打破这种僵局。我希望打造一个**属于大学生的数字化、极客化看板**，让每一位学子通过数据亮出实力，通过平台精准集结，让竞赛组队不再是“抽盲盒”，而是一场精准的技术碰撞。

## 项目核心亮点 (Technical Excellence)

- **进化的 Bento 仪表盘**：采用目前前沿的便签盒式设计，将原本沉重的图表转化为轻量化的原生 CSS 组件。这不仅是视觉的升级，更解决了第三方可视化库对页面首屏加载的性能拖累。
- **真正的多线程计算**：不仅仅渲染热力图。我利用 **Web Workers** 建立了一个独立的数据哨兵，将年度活跃矩阵的复杂聚类和处理移出 UI 线程。结果是明显的：即使在处理上万次逻辑判断时，页面滑动依然如丝般顺滑。
- **全局主题感知引擎**：这不只是简单的亮暗切换。系统内置了基于 `localStorage` 的状态持久化与系统级颜色偏好监听。通过 CSS 原生变量驱动的 UI Token 体系，确保了在切换时的零延迟过渡。
- **极客叙事系统**：利用“成长内核”时间轴与“荣誉勋章墙”，将原本冰冷的个人资料页面转化为动态的“技术进化史”。这种叙事性的设计能更有效地向 potential teammates 或面试官展示你的深度。

## 技术矩阵

- **核心**: Vue 3.5+ (Composition API) & `<script setup>`
- **状态**: Pinia (模块化状态流域)
- **构建**: Vite 6.x (极致的 HMR 体验)
- **离线**: JavaScript Web Workers API
- **设计**: Glassmorphism 2.0 & Bento Layout

## 快速启动

```bash
# 获取集结号
git clone https://github.com/your-username/campushub.git

# 装备依赖
pnpm install

# 核心同步
pnpm dev
```

<p align="center">
  保持热爱，持续进化。
</p>
