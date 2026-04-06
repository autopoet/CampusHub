<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message, User, Plus } from '@element-plus/icons-vue'

const router = useRouter()

const myTeams = ref([
  { id: 1, name: 'Web3 骇客马拉松', role: '队长', status: '招募中', members: 3, total: 6, tech: ['Solidity', 'Vue3', 'Node.js'] },
  { id: 2, name: '大创：校园二手书交易平台', role: '前端架构', status: '进行中', members: 5, total: 5, tech: ['React', 'Spring Cloud'] }
])

const goToRecruit = () => {
  router.push('/home/index/recruit')
}
</script>

<template>
  <div class="teams-container">
    <div class="page-header">
      <h2 class="page-title">我的队伍 // MY_TEAMS</h2>
      <button class="gh-btn-primary" @click="goToRecruit"><el-icon><Plus /></el-icon> 寻找新队友</button>
    </div>

    <div class="teams-grid">
      <div v-for="team in myTeams" :key="team.id" class="team-card modern-panel">
        <div class="team-status-bar" :class="team.status === '招募中' ? 'is-active' : 'is-full'"></div>
        <div class="team-header">
          <div class="team-meta">
            <h3 class="team-name">{{ team.name }}</h3>
            <span class="team-status-tag">{{ team.status }}</span>
          </div>
          <div class="team-members">
             <span class="num">{{ team.members }}/{{ team.total }}</span>
             <el-icon class="icon"><User /></el-icon>
          </div>
        </div>

        <div class="team-body">
           <div class="info-row">
              <span class="label">当前角色:</span>
              <span class="value">{{ team.role }}</span>
           </div>
           <div class="info-row">
              <span class="label">技术栈:</span>
              <div class="tags">
                 <span v-for="t in team.tech" :key="t" class="tag">{{ t }}</span>
              </div>
           </div>
        </div>

        <div class="team-footer">
           <button class="action-btn">管理队伍</button>
           <button class="action-btn outline">查看项目</button>
        </div>
      </div>

      <div v-if="myTeams.length === 0" class="empty-state modern-panel">
         <el-icon class="icon"><Message /></el-icon>
         <p>你还没有加入任何队伍</p>
         <button class="gh-btn-subtle" @click="goToRecruit">去大厅逛逛</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teams-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-title { font-size: 22px; font-weight: 800; color: var(--color-fg-default); }

.teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
@media (max-width: 768px) { .teams-grid { grid-template-columns: 1fr; } }

.modern-panel { background: var(--color-canvas-default); border: 1px solid var(--color-border-default); border-radius: 20px; overflow: hidden; }

.team-card { position: relative; padding: 24px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.team-card:hover { transform: translateY(-8px); border-color: var(--color-accent-fg); box-shadow: 0 12px 32px -10px var(--color-shadow); }

.team-status-bar { position: absolute; left: 0; top: 0; width: 4px; height: 100%; }
.is-active { background: var(--color-success-fg); }
.is-full { background: var(--color-accent-fg); }

.team-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.team-name { font-size: 18px; font-weight: 800; color: var(--color-fg-default); margin-bottom: 8px; }
.team-status-tag { font-size: 11px; font-weight: 700; color: var(--color-fg-subtle); background: var(--color-canvas-subtle); padding: 4px 10px; border-radius: 20px; }

.team-members { display: flex; align-items: center; gap: 6px; color: var(--color-fg-muted); font-weight: 800; }
.num { font-family: 'Fira Code', monospace; }

.team-body { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
.info-row { display: flex; gap: 12px; font-size: 14px; }
.label { color: var(--color-fg-subtle); width: 70px; }
.value { color: var(--color-fg-default); font-weight: 600; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { font-size: 11px; background: var(--color-accent-subtle); color: var(--color-accent-fg); padding: 2px 8px; border-radius: 6px; font-weight: 600; }

.team-footer { display: flex; gap: 12px; padding-top: 16px; border-top: 1px dashed var(--color-border-muted); }
.action-btn { flex: 1; padding: 10px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; background: var(--color-btn-primary-bg); color: #fff; transition: 0.2s; }
.action-btn.outline { background: var(--color-canvas-subtle); color: var(--color-fg-muted); border: 1px solid var(--color-border-muted); }
.action-btn:hover { filter: brightness(1.1); }

.gh-btn-primary { background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6); color: #fff; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(9, 105, 218, 0.2); }
.empty-state { grid-column: 1 / -1; padding: 80px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--color-fg-subtle); }
</style>
