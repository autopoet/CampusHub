<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: '搜索标题或关键字...' },
  showCompetition: { type: Boolean, default: true },
  showSkills: { type: Boolean, default: true },
  showStatus: { type: Boolean, default: true }
})

const emit = defineEmits(['filter'])

const keyword = ref('')
const selectedCompetition = ref('')
const selectedSkills = ref([])
const selectedStatus = ref('')

const competitions = ['蓝桥杯', '大创', '计算机设计大赛', '软件杯', '数学建模', '挑战杯', '互联网+', '机器人大赛']
const skills = ['Vue3', 'React', 'Node.js', 'Java', 'Python', 'MySQL', 'Docker', 'Figma', 'UI 设计', 'Uni-app', 'Kotlin', 'Three.js']
const statuses = ['招募中', '已满员']

const handleFilterChange = () => {
  emit('filter', {
    keyword: keyword.value,
    competition: selectedCompetition.value,
    skills: selectedSkills.value,
    status: selectedStatus.value
  })
}

// 实时搜索防抖
let timeout = null
watch(keyword, () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    handleFilterChange()
  }, 300)
})

watch([selectedCompetition, selectedSkills, selectedStatus], () => {
  handleFilterChange()
})

const clearFilters = () => {
  keyword.value = ''
  selectedCompetition.value = ''
  selectedSkills.value = []
  selectedStatus.value = ''
  handleFilterChange()
}
</script>

<template>
  <div class="filter-bar-glass">
    <div class="search-section">
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
        <input 
          type="text" 
          v-model="keyword" 
          :placeholder="placeholder" 
          class="premium-input"
        />
      </div>
      <button class="clear-btn" @click="clearFilters">重置筛选</button>
    </div>

    <div class="multi-filter-row">
      <!-- 比赛筛选 -->
      <div class="filter-group" v-if="showCompetition">
        <label>所属竞赛</label>
        <select v-model="selectedCompetition" class="premium-select">
          <option value="">全部竞赛</option>
          <option v-for="c in competitions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- 技能筛选 (简化多选为下拉) -->
      <div class="filter-group" v-if="showSkills">
        <label>所需技能</label>
        <select v-model="selectedSkills" class="premium-select" multiple>
          <option v-for="s in skills" :key="s" :value="s">{{ s }}</option>
        </select>
        <div class="hint-text">按住 Ctrl 多选</div>
      </div>

      <!-- 状态筛选 -->
      <div class="filter-group" v-if="showStatus">
        <label>当前状态</label>
        <select v-model="selectedStatus" class="premium-select">
          <option value="">全部状态</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-bar-glass {
  background: rgba(var(--color-canvas-default-rgb, 255, 255, 255), 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--color-fg-muted);
  pointer-events: none;
}

.premium-input {
  width: 100%;
  padding: 12px 12px 12px 48px;
  border-radius: 12px;
  border: 2px solid var(--color-border-default);
  background: var(--color-canvas-default);
  color: var(--color-fg-default);
  font-size: 15px;
  transition: all 0.2s;
}

.premium-input:focus {
  border-color: var(--color-accent-fg);
  outline: none;
  box-shadow: 0 0 0 4px rgba(9, 105, 218, 0.1);
}

.clear-btn {
  padding: 0 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border-default);
  background: var(--color-canvas-subtle);
  color: var(--color-fg-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.clear-btn:hover {
  background: var(--color-border-default);
  color: var(--color-fg-default);
}

.multi-filter-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: var(--color-canvas-default);
  color: var(--color-fg-default);
  font-size: 14px;
  cursor: pointer;
}

.premium-select:focus {
  border-color: var(--color-accent-fg);
  outline: none;
}

.hint-text { font-size: 11px; color: var(--color-fg-subtle); margin-top: 2px; }

@media screen and (max-width: 768px) {
  .multi-filter-row { flex-direction: column; gap: 16px; }
  .filter-group { min-width: 100%; }
}
</style>
