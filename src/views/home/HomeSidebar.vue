<script setup>
import { inject } from "vue"

const openPublishModal = inject("openPublishModal")

const goToRecruit = () => openPublishModal("recruit")
const goToShare = () => openPublishModal("share")

const announcements = [
  { id: 1, text: "关于严禁在组队区发布违规商业兼职信息的公告", date: "03-11" },
  { id: 2, text: "蓝桥杯省赛倒计时 14 天！快来寻找你的最后一块拼图！", date: "03-10" }
]

const hotTeams = [
  { id: 1, title: "大创国家级项目缺鸿蒙开发！", tag: "急缺" },
  { id: 2, title: "阿里天池算法竞赛前端可视化缺人", tag: "算法组" }
]
</script>

<template>
  <div class="sidebar-container">

    <!-- 操作按钮区 -->
    <div class="sidebar-card action-card">
      <div class="action-title">创作中心</div>
      <div class="action-btns">
        <button class="action-btn btn-primary" @click="goToRecruit">
          <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          招募
        </button>
        <button class="action-btn btn-ghost" @click="goToShare">
          <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          分享
        </button>
      </div>
    </div>

    <!-- 系统状态卡 -->
    <div class="sidebar-card status-card">
      <div class="wave-bars">
        <div class="bar" v-for="i in 5" :key="i" :style="{ animationDelay: i * 0.1 + 's' }"></div>
      </div>
      <div class="status-info">
        <span class="dot"></span>
        <span>系统运行中</span>
      </div>
    </div>

    <!-- 平台公告卡 -->
    <div class="sidebar-card info-card">
      <div class="card-title">平台公告</div>
      <ul class="announce-list">
        <li v-for="item in announcements" :key="item.id" class="announce-item">
          {{ item.text }}
        </li>
      </ul>
    </div>

    <!-- 热门队伍卡 -->
    <div class="sidebar-card info-card">
      <div class="card-title">热门队伍</div>
      <ul class="team-list">
        <li v-for="team in hotTeams" :key="team.id" class="team-item">
          <span class="team-name text-ellipsis">{{ team.title }}</span>
          <span class="team-tag">{{ team.tag }}</span>
        </li>
      </ul>
    </div>

    <!-- 版权 -->
    <div class="footer-note">
      <span>指南</span> · <span>协议</span> · <span>隐私</span>
      <div>2026 CampusHub Team</div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: var(--color-canvas-default);
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 18px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.sidebar-card:hover {
  box-shadow: 0 8px 24px var(--color-shadow);
  border-color: var(--color-accent-fg);
}

/* 操作按钮区 */
.action-card {
  background: linear-gradient(135deg, var(--color-canvas-default), var(--color-accent-subtle));
}

.action-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg-muted);
  margin-bottom: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.action-btns {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.btn-primary {
  background-color: var(--color-btn-primary-bg);
  color: #ffffff;
  border-color: var(--color-btn-primary-border);
}

.btn-primary:hover {
  background-color: var(--color-btn-primary-hover-bg);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 164, 78, 0.35);
}

.btn-ghost {
  background-color: var(--color-btn-bg);
  color: var(--color-fg-default);
  border-color: var(--color-border-default);
}

.btn-ghost:hover {
  background-color: var(--color-btn-hover-bg);
  border-color: var(--color-accent-fg);
  color: var(--color-accent-fg);
  transform: translateY(-1px);
}

/* 系统状态卡 */
.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #0d1117, #161b22);
  border-color: #30363d;
  color: #e6edf3;
  padding: 14px 18px;
}

.wave-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 20px;
}

.bar {
  width: 4px;
  height: 100%;
  background: #2f81f7;
  border-radius: 2px;
  animation: wave 0.8s ease-in-out infinite alternate;
}

@keyframes wave {
  0% { height: 30%; opacity: 0.4; }
  100% { height: 100%; opacity: 1; }
}

.status-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #7d8590;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3fb950;
  border-radius: 50%;
  box-shadow: 0 0 8px #3fb950;
  flex-shrink: 0;
}

/* 信息卡 */
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-fg-default);
  margin-bottom: 14px;
}

.announce-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.announce-item {
  font-size: 13px;
  color: var(--color-fg-muted);
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s;
}

.announce-item:hover {
  color: var(--color-accent-fg);
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-muted);
  cursor: pointer;
}

.team-item:last-child {
  border-bottom: none;
}

.team-name {
  font-size: 13px;
  color: var(--color-fg-default);
  flex: 1;
}

.team-item:hover .team-name {
  color: var(--color-accent-fg);
}

.team-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--color-canvas-subtle);
  color: var(--color-fg-muted);
  border: 1px solid var(--color-border-default);
  white-space: nowrap;
  flex-shrink: 0;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 版权 */
.footer-note {
  font-size: 12px;
  color: var(--color-fg-subtle);
  text-align: center;
  padding: 4px 0;
  line-height: 2;
}

.footer-note span {
  cursor: pointer;
}
.footer-note span:hover {
  color: var(--color-accent-fg);
}
</style>
