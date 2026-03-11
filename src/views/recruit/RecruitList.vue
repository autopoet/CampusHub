<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '@/components/ui/FeedCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'

const router = useRouter()
const loading = ref(true)

const goToDetail = (id) => {
  router.push(`/home/detail/${id}`)
}

const list = ref([])

onMounted(() => {
  setTimeout(() => {
    // 招募大厅专属数据 (扩充至 8 条)
    list.value = [
      {
        id: 1,
        type: 'recruit',
        author: '前端小牛',
        action: '发起组队招募',
        title: '蓝桥杯 Web 应用开发国赛组队，缺一后端！',
        excerpt: '目前我们队伍有一个前端和一个UI，准备报名今年的蓝桥杯Web赛道。前端技术栈是Vue3+Pinia，UI用Figma。现在急需一名熟悉 Node.js 或者 Java SpringBoot 的后端大佬加入。比赛期间一周最好能抽出10小时一起交流。',
        competition: '蓝桥杯',
        requiredSkills: ['Node.js', 'Java', 'MySQL'],
        status: '招募中',
        updatedTime: '2 小时前',
        isFavorite: false,
        commentCount: 8,
      },
      {
        id: 2,
        type: 'recruit',
        author: '极客实验室',
        action: '发布了寻人启事',
        title: '大创国家级立项，做校园闲置物品流转系统，求移动端开发人员',
        excerpt: '我们的大创项目已经成功拿到国家级立项，目前预算充足。系统主要做校园内的二手闲置流转，结合智能推荐算法。后端基础搭建已完成。现求一两名熟悉 Uni-app 或 鸿蒙系统开发的同学，一起将系统落地。有奖励！',
        competition: '大创 / 挑战杯',
        requiredSkills: ['Uni-app', '鸿蒙开发'],
        status: '招募中',
        updatedTime: '昨天 14:30',
        isFavorite: false,
        commentCount: 23,
      },
      {
        id: 3,
        type: 'recruit',
        author: '算法练习生',
        action: '发起组队招募',
        title: ' Kaggle 数据挖掘竞赛：信用卡欺诈检测，求求带带！',
        excerpt: '本人目前大三，熟悉基础的机器学习算法（XGBoost, Random Forest），想找几个小伙伴一起打这周末结束的 Kaggle 新手赛。不求拿到名次，但求完整走一遍特征工程、模型搭建和调参的流程。',
        competition: 'Kaggle',
        requiredSkills: ['Python', 'Pandas', 'Sklearn'],
        status: '招募中',
        updatedTime: '昨天 09:15',
        isFavorite: true,
        commentCount: 12,
      },
      {
        id: 4,
        type: 'recruit',
        author: 'AI 探索者',
        action: '寻找创业合伙人',
        title: '基于大模型的智能简历修改助手，已有商业计划书',
        excerpt: '目前 LLM 在垂类场景非常有应用前景。我这有一份打磨了一个月的 BP，核心思路是用 Prompt Engineering 结合 RAG 辅助应届生修改秋招简历。诚邀一位全栈工程师，负责前后端联调。股份平分！',
        competition: '互联网+',
        requiredSkills: ['Next.js', 'LangChain', 'OpenAI API'],
        status: '招募中',
        updatedTime: '2 天前',
        isFavorite: false,
        commentCount: 45,
      },
      {
        id: 5,
        type: 'recruit',
        author: '野生设计师',
        action: '发布了寻人启事',
        title: '想做一个极致优雅的番茄钟 App，我已经画好了图，就差程序员了',
        excerpt: '发现市面上的番茄钟都太丑了，或者广告太多。我自己用 Figma 构思了一套玻璃拟物化风格（Glassmorphism）的 UI 界面，包含极简模式和白噪音功能。有没有做 iOS 独立开发的老哥想合作搞一个上架？',
        competition: '独立开发',
        requiredSkills: ['SwiftUI', 'Figma'],
        status: '已满员',
        updatedTime: '3 天前',
        isFavorite: false,
        commentCount: 108,
      },
      {
        id: 6,
        type: 'recruit',
        author: 'Web3 冲浪手',
        action: '发起组队招募',
        title: 'ETHGlobal 黑客松下个月开始，组队搞 DApp！',
        excerpt: '想去冲一波 ETHGlobal 的奖金池。这次想做一个去中心化的学术论文众筹发表平台，解决学术界版面费太贵的问题。需要会写 Solidity 智能合约和前端 Ethers.js 交互的兄弟！',
        competition: '黑客松 (Hackathon)',
        requiredSkills: ['Solidity', 'React', 'Ethers.js'],
        status: '招募中',
        updatedTime: '4 天前',
        isFavorite: false,
        commentCount: 15,
      },
      {
        id: 7,
        type: 'recruit',
        author: '安全实验室',
        action: '发布了内部招募',
        title: 'CTF 战队招新！欢迎有逆向和 Web 安全基础的新血加入',
        excerpt: '校内顶尖信息安全战队第 9 届招新正式开启！如果你对二进制或者渗透测试有浓厚兴趣，并且自己挖过简单的漏洞或者打过初级 CTF 靶场，欢迎投递简历。我们有学长手把手带练。',
        competition: 'CTF',
        requiredSkills: ['Web 安全', 'Reverse', 'PWN'],
        status: '招募中',
        updatedTime: '1 周前',
        isFavorite: true,
        commentCount: 66,
      },
      {
        id: 8,
        type: 'recruit',
        author: '游戏制作狂',
        action: '寻找志同道合的人',
        title: '参加 Game Jam：打算在 48 小时内做一款像素风肉鸽游戏',
        excerpt: '两年 Unity 开发经验，擅长 2D 动作系统。这次 Game Jam 的主题刚好有灵感。急缺一位会画像素画（Pixel Art）的美术，以及能弄点芯片音乐（Chiptune）的音效老哥，主打一个陪伴和爆肝。',
        competition: 'Game Jam',
        requiredSkills: ['Unity', '像素画', '音效设计'],
        status: '招募中',
        updatedTime: '1 周前',
        isFavorite: false,
        commentCount: 29,
      }
    ]
    loading.value = false
  }, 1000)
})

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
}
</script>

<template>
  <div class="topstory-content">
    <div class="feed-list">
      <template v-if="loading">
        <SkeletonCard v-for="i in 3" :key="i" />
      </template>

      <template v-else>
        <FeedCard
          v-for="item in list"
          :key="item.id"
          :author="item.author"
          :action="item.action"
          :time="item.updatedTime"
          @click="goToDetail(item.id)"
        >
          <template #title>
            <h2 class="feed-title">
              {{ item.title }}
              <span class="status-tag" :class="item.status === '招募中' ? 'status-active' : 'status-full'">
                {{ item.status }}
              </span>
            </h2>
          </template>

          <template #tags>
            <span class="comp-tag" v-if="item.competition">{{ item.competition }}</span>
            <span v-for="(skill, index) in item.requiredSkills" :key="index" class="skill-tag">
              {{ skill }}
            </span>
          </template>

          <p class="excerpt">{{ item.excerpt }}</p>

          <template #footer>
            <div class="other-actions">
              <button class="action-btn" @click.stop>
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 5.582 2 10c0 1.81.742 3.477 1.986 4.793-.162 1.353-.87 2.946-1.554 3.753a.5.5 0 0 0 .584.767c1.78-.9 3.864-1.574 5.253-1.895C9.434 17.79 10.686 18 12 18c5.523 0 10-3.582 10-8s-4.477-8-10-8Z"/></svg>
                <span class="text-hide-mobile">{{ item.commentCount }} 条评论</span>
              </button>
              <button class="action-btn" @click.stop>
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M16 5l-1.42 1.42L16.16 8H9a5 5 0 0 0 0 10h2v-2H9a3 3 0 0 1 0-6h7.16l-1.58 1.58L16 13l4-4-4-4z"/></svg>
                <span class="text-hide-mobile">分享招募</span>
              </button>
              <button
                class="action-btn"
                :class="{ 'is-favorite': item.isFavorite }"
                @click.stop="toggleFavorite(item)"
              >
                <svg class="btn-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span class="text-hide-mobile">{{ item.isFavorite ? '已收藏' : '收藏' }}</span>
              </button>
            </div>
          </template>
        </FeedCard>
      </template>
    </div>
  </div>
</template>

<style scoped>
.feed-list { 
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-title { 
  font-size: 16px; 
  font-weight: 600; 
  color: var(--color-fg-default); 
  margin: 0 0 8px 0; 
  line-height: 1.5; 
  display: flex; 
  align-items: flex-start; 
  flex-wrap: wrap; 
  gap: 8px; 
}

.status-tag { font-size: 11px; padding: 1px 10px; border-radius: 12px; margin-left: auto; font-weight: 500; border: 1px solid transparent; flex-shrink: 0; margin-top: 2px;}
.status-active { background-color: var(--color-success-subtle, #dafbe1); color: var(--color-success-fg, #1a7f37); border-color: rgba(26, 127, 55, 0.2); }
[data-theme='dark'] .status-active { background-color: rgba(46, 160, 67, 0.15); color: #3fb950; border-color: rgba(46, 160, 67, 0.4); }
.status-full { background-color: var(--color-canvas-subtle); color: var(--color-fg-muted); border-color: var(--color-border-default); }

.comp-tag { 
  font-size: 11px; 
  background-color: var(--color-attention-subtle, rgba(212, 167, 44, 0.1)); 
  color: var(--color-attention-fg, #9a6700); 
  padding: 2px 8px; 
  border-radius: 12px; 
  font-weight: 500; 
  border: 1px solid var(--color-attention-muted, rgba(212, 167, 44, 0.4)); 
}
[data-theme='dark'] .comp-tag { background-color: rgba(212, 167, 44, 0.15); color: #d4a72c; }
.skill-tag { font-size: 11px; color: var(--color-fg-muted); border: 1px solid var(--color-border-default); padding: 1px 8px; border-radius: 12px; background-color: var(--color-canvas-subtle); }

.excerpt { font-size: 14px; color: var(--color-fg-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; }

.other-actions { display: flex; gap: 12px; }

.action-btn { 
  background: var(--color-canvas-subtle); 
  border: 1px solid var(--color-border-default);
  color: var(--color-fg-muted); 
  font-size: 12px; 
  cursor: pointer; 
  padding: 6px 12px; 
  border-radius: 8px;
  transition: all 0.2s ease; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  flex: 1;
  justify-content: center;
}

.action-btn:hover { 
  color: var(--color-accent-fg); 
  background: var(--color-canvas-overlay);
  border-color: var(--color-accent-fg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.btn-icon { width: 14px; height: 14px; flex-shrink: 0; }
.action-btn.is-favorite { color: var(--color-danger-fg, #cf222e); }
.action-btn:active { transform: scale(0.95); }

@media screen and (max-width: 768px) {
  .feed-list { grid-template-columns: 1fr; gap: 16px; }
  .feed-title { font-size: 16px; margin-bottom: 8px; line-height: 1.5; align-items: flex-start;}
  .excerpt { -webkit-line-clamp: 4; line-clamp: 4; }
  .action-btn span.text-hide-mobile { display: none; }
}
</style>
