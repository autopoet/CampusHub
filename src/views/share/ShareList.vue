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
    // 干货分享专属数据 (扩充至 8 条)
    list.value = [
      {
        id: 1,
        type: 'share',
        author: '架构师老张',
        action: '分享了比赛经验贴',
        title: '计算机设计大赛国一经验贴：如何写好一份漂亮的答辩PPT？',
        excerpt: '很多人代码写得好，但是在计设答辩环节吃了大亏。答辩只有不到10分钟，评委根本没时间看你的每一行代码。你需要在一开始就抛出项目解决的市场痛点、商业价值，然后用架构图展示技术难点。本文分享了我们队伍去年拿国一使用的PPT模板与演讲逐字稿...',
        competition: '计算机设计大赛',
        tags: ['答辩技巧', 'PPT模板', '干货分享'],
        commentCount: 120,
        updatedTime: '5 小时前',
        isFavorite: false,
      },
      {
        id: 2,
        type: 'share',
        author: '前端架构师阿飞',
        action: '发布了技术长文',
        title: 'Vue3 性能调优指南：从 500ms 到 50ms 的极致首屏加载',
        excerpt: '在这篇文章中，我们将深入探讨 Vue3 渲染引擎背后的机制，了解什么是 Block Tree 以及如何利用 keep-alive 和异步组件切割代码体积。我将结合大厂的真实落地案例，一步步带你排查性能瓶颈。附送自动化检测脚本。',
        competition: '日常分享',
        tags: ['Vue3', '性能优化', '前端架构'],
        commentCount: 342,
        updatedTime: '昨天 19:20',
        isFavorite: true,
      },
      {
        id: 3,
        type: 'share',
        author: 'AI 绘画大师',
        action: '分享了实战教程',
        title: 'Midjourney V6 高阶调教指南：如何生成具有电影质感的插画？',
        excerpt: 'V6 模型的语义理解有了质的飞跃。在这篇教程里，我总结了 50 个高保真电影级提示词（Prompt）公式。从摄像机位、镜头焦段（例如 35mm lens）、光影色调（Cinematic lighting）到风格参考，教你一键出高质量的游戏立绘。',
        competition: '日常分享',
        tags: ['AIGC', 'Midjourney', '设计教程'],
        commentCount: 89,
        updatedTime: '2 天前',
        isFavorite: false,
      },
      {
        id: 4,
        type: 'share',
        author: '云原生追梦人',
        action: '发布了技术笔记',
        title: 'Docker + K8s：如何优雅地把你的毕业项目部署到云端？',
        excerpt: '每次毕设答辩带个 U 盘过去跑代码都怕出锅？这篇文章手把手教你如何白嫖云服务器，用 Docker 容器化你的 SpringBoot + Vue 项目，并通过 K8s 编写简单的编排文件（YAML）。学完直接写到简历里作为“微服务实战经验”。',
        competition: '软件杯',
        tags: ['Docker', 'K8s', 'DevOps'],
        commentCount: 201,
        updatedTime: '2 天前',
        isFavorite: false,
      },
      {
        id: 5,
        type: 'share',
        author: '数学建模大佬',
        action: '分享了备考资料',
        title: '国赛备战必备：美赛/国赛历年优秀论文核心排版格式与工具推荐',
        excerpt: '数学建模比赛，排版占了印象分的很大比重。还在用 Word 痛苦地对齐公式？强烈推荐队伍里的排版手学习 LaTeX（Overleaf）。我打包了 3 套我们拿过美赛 M 奖和国赛一等奖的现成 LaTeX 模板，直接填内容就能出神作。',
        competition: '数学建模',
        tags: ['LaTeX', '排版工具', '历年真题'],
        commentCount: 456,
        updatedTime: '3 天前',
        isFavorite: true,
      },
      {
        id: 6,
        type: 'share',
        author: '算法修行者',
        action: '发布了刷题总结',
        title: '蓝桥杯 Java B组冲刺：动态规划（DP）考点深度源码剖析',
        excerpt: '今年蓝桥杯省赛即将在四月开打。根据近五年的真题分析，DP 绝对是拉开差距的分水岭。这篇长文总结了背包模型、区间DP和树形DP的核心状态转移方程，并配备了详细的图解记忆法，让你在考场上能够迅速看透题目本质。',
        competition: '蓝桥杯',
        tags: ['算法', '动态规划', '真题解析'],
        commentCount: 78,
        updatedTime: '4 天前',
        isFavorite: false,
      },
      {
        id: 7,
        type: 'share',
        author: '产品思维',
        action: '分享了比赛复盘',
        title: '产品经理视角：大创/挑战杯如何写出一份让评委亮眼的商业计划书 (BP)?',
        excerpt: '很多技术流队伍做出来的东西特别牛，但是没有商业落地的可能，这在挑战杯这种赛事里是致命的。我作为连续两年斩获国家银奖的项目负责人，和大家聊一下怎么讲好一个“有社会价值+商业闭环”的创业故事。',
        competition: '挑战杯',
        tags: ['商业计划书', '产品方法论', 'BP模板'],
        commentCount: 165,
        updatedTime: '5 天前',
        isFavorite: false,
      },
      {
        id: 8,
        type: 'share',
        author: '安全客',
        action: '发布了技术专栏',
        title: 'Web 渗透实战：从 0 到 1 黑掉一台靶机（附配套学习环境）',
        excerpt: '这是一篇写给信息安全新手的保姆级入门教程。涵盖了基础的网络扫描（Nmap）、SQL 盲注、提权等核心环节。为了方便大家动手，我还打包好了一台基于 VirtualBox 的靶场镜像靶机，可以跟着教程一步步还原真实的攻击链路。',
        competition: '信息安全竞赛',
        tags: ['渗透测试', '靶机实战', '信息安全'],
        commentCount: 228,
        updatedTime: '1 周前',
        isFavorite: true,
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
            <h2 class="feed-title">{{ item.title }}</h2>
          </template>
          
          <template #tags>
            <span class="comp-tag" v-if="item.competition">{{ item.competition }}</span>
            <span v-for="(tag, index) in item.tags" :key="index" class="info-tag">
              {{ tag }}
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
                <span class="text-hide-mobile">分享</span>
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

.feed-title { font-size: 16px; font-weight: 600; color: var(--color-fg-default); margin: 0 0 8px 0; line-height: 1.5; }

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

.info-tag { font-size: 12px; color: var(--color-fg-muted); border: 1px solid var(--color-border-default); padding: 1px 8px; border-radius: 12px; background-color: var(--color-canvas-subtle); }

.excerpt { font-size: 14px; color: var(--color-fg-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px;}

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
  .feed-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .feed-title { font-size: 16px; margin-bottom: 8px; line-height: 1.5; }
  .excerpt { -webkit-line-clamp: 4; line-clamp: 4; }
  .action-btn span.text-hide-mobile { display: none; }
}
</style>
