<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '@/components/ui/FeedCard.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import { geekToast } from '@/utils/toast.js'

const router = useRouter()
const loading = ref(true)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const observerTarget = ref(null)
let observer = null

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
      },
      {
        id: 9,
        type: 'recruit',
        author: '三秦极客',
        action: '发起组队招募',
        title: '西安交通大学“腾飞杯”创业大赛，寻找 UI 和产品经理',
        excerpt: '针对校园快递最后一百米配送问题，我们已经开发了基于视觉识别的自动分拣原型。由于团队清一色工科男，急需艺术学院或经管学院的同学协助打磨 UI 界面和撰写 BP。',
        competition: '腾飞杯',
        requiredSkills: ['Figma', '商业计划书', '产品思维'],
        status: '招募中',
        updatedTime: '3 小时前',
        isFavorite: false,
        commentCount: 14,
      },
      {
        id: 10,
        type: 'recruit',
        author: '西电安全尖兵',
        action: '寻找队友',
        title: '陕西省网安大赛组队，缺一个负责 Web 渗透的',
        excerpt: '目前队伍里有搞逆向的和搞密码学的。我负责 Misc。差一个 Web 狗，最好打过 AWD 模式的。大家一起冲下省赛前三，奖金丰厚！',
        competition: '省网安赛',
        requiredSkills: ['Web 安全', 'SQL 注入', 'XSS'],
        status: '招募中',
        updatedTime: '5 小时前',
        isFavorite: false,
        commentCount: 9,
      },
      {
        id: 11,
        type: 'recruit',
        author: '长安数据星',
        action: '发布招募',
        title: '陕西省数学建模赛，求一个 MATLAB 高手',
        excerpt: '我们队伍有两个负责论文和建模的，现在缺一个主要负责代码实现的。最好对优化算法或者神经网络比较熟悉的，能熟练操作 MATLAB 或者 Python。',
        competition: '数学建模省赛',
        requiredSkills: ['MATLAB', 'Python', '建模'],
        status: '招募中',
        updatedTime: '22 小时前',
        isFavorite: false,
        commentCount: 18,
      },
      {
        id: 12,
        type: 'recruit',
        author: '陕科大创造者',
        action: '发起招募',
        title: '挑战杯：基于边缘计算的农作物病虫害识别系统，求 AI 算法同学',
        excerpt: '项目已经入围校赛决赛。目前使用的是基础的 CNN 模型，识别率有待提高。寻求一位熟悉轻量化模型（如 MobileNet, YOLO）的同学，能够将模型优化并部署到嵌入式设备上。',
        competition: '挑战杯',
        requiredSkills: ['PyTorch', 'YOLO', '嵌入式'],
        status: '招募中',
        updatedTime: '昨天',
        isFavorite: false,
        commentCount: 31,
      },
      {
        id: 13,
        type: 'recruit',
        author: '硬核嵌入式',
        action: '寻找队友',
        title: 'TI 赛区电子设计大赛，寻找电子信息/通信工程方向战友',
        excerpt: '坐标西安，计划参加今年的电赛省赛。我已经准备好了 STM32 的开发板和一系列传感器。需要一位对模拟电路设计或者信号处理比较有心得的战友，咱们一起拿省一。',
        competition: '电赛省赛',
        requiredSkills: ['STM32', '电路设计', '信号处理'],
        status: '招募中',
        updatedTime: '2 天前',
        isFavorite: true,
        commentCount: 12,
      },
      {
        id: 14,
        type: 'recruit',
        author: '西北云玩家',
        action: '发布招募',
        title: '西北赛区机甲大师 (RoboMaster) 联盟赛，急招嵌入式成员',
        excerpt: '我校战队目前步兵机器人底盘代码还有 Bug。需要对 PID 调节、Can 总线通信熟悉的同学紧急支援。战队在西安南郊，提供实验室和全部耗材支持。',
        competition: '机甲大师',
        requiredSkills: ['C语言', 'PID', 'FreeRTOS'],
        status: '招募中',
        updatedTime: '3 天前',
        isFavorite: false,
        commentCount: 52,
      },
      {
        id: 15,
        type: 'recruit',
        author: '秦创原实习生',
        action: '寻找合伙人',
        title: '针对秦创原产业链的开源软件协同平台，求前端大佬',
        excerpt: '目前后端基于 Rust 完成。需要一位 Vue3 大佬负责前端工程搭建。项目有西咸新区政策支持。目标是打造一个西安本土的开源协作社区。',
        competition: '开源挑战赛',
        requiredSkills: ['Vue3', 'Arco Design', 'TypeScript'],
        status: '招募中',
        updatedTime: '1 周前',
        isFavorite: false,
        commentCount: 22,
      }
    ]
    loading.value = false
    // 重要：等 Vue 把 v-else 里的 DOM 渲染出来，再去找那个哨兵
    nextTick(() => {
      setupObserver()
    })
  }, 1000)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingMore.value && hasMore.value) {
        loadMore()
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px 200px 0px' } // 提前 200 像素就开始加载，更丝滑
  )
  if (observerTarget.value) {
    observer.observe(observerTarget.value)
  }
}

const loadMore = () => {
  if (isLoadingMore.value || !hasMore.value) return
  
  isLoadingMore.value = true
  
  // 模拟网络加载，设置 1.5 秒延迟让你看清加载状态
  setTimeout(() => {
    const currentLen = list.value.length
    const moreData = [
      {
        id: currentLen + 101,
        type: 'recruit',
        author: '极客补给站',
        action: '发布了新动态',
        title: `全栈开发：模拟面试系统 (深度迭代第 ${Math.floor(currentLen / 4)} 阶段)`,
        excerpt: '本项目旨在利用 AI 模拟大厂面试官进行真人对练。目前前端部分已完成 80%，急需一名熟悉后端 RAG 架构或者有大模型微调经验的同学加入。项目已获得校赛直通名额，诚邀硬核队友！',
        competition: '互联网+',
        requiredSkills: ['Python', 'LangChain', 'OpenAI'],
        status: '招募中',
        updatedTime: '刚刚',
        isFavorite: false,
        commentCount: 0,
      },
      {
        id: currentLen + 102,
        type: 'recruit',
        author: '代码守望者',
        action: '发起组队',
        title: '针对养老场景的智能助餐系统，寻找嵌入式硬件合作伙伴',
        excerpt: '这是一个结合了物联网与边缘计算的公益项目。我们需要设计一套智能识别菜品并自动计算热量的硬件终端。如果你对树莓派、传感器集成有浓厚兴趣，欢迎加入我们的“夕阳红”科技小队。',
        competition: '挑战杯',
        requiredSkills: ['树莓派', 'C++', '视觉算法'],
        status: '招募中',
        updatedTime: '刚刚',
        isFavorite: false,
        commentCount: 2,
      },
      {
        id: currentLen + 103,
        type: 'recruit',
        author: 'UI 魔法师',
        action: '寻找队友',
        title: '想要复刻一个极简风格的“Notion”替代品，求一名前端大佬',
        excerpt: '我已经完成了全部的交互原型设计，主打本地优先和加密存储。现在需要一位对 TipTap 或 Prosemirror 这种富文本引擎有研究的前端同学一起合作开发。',
        competition: '独立开发',
        requiredSkills: ['TipTap', 'Prosemirror', 'Vue3'],
        status: '招募中',
        updatedTime: '刚刚',
        isFavorite: false,
        commentCount: 5,
      },
      {
        id: currentLen + 104,
        type: 'recruit',
        author: '三秦赛客',
        action: '发起招募',
        title: '陕西省大学生程序设计竞赛（ACM-ICPC省赛）组队，求金牌大腿',
        excerpt: '我目前刷题量 500+，擅长动态规划和字符串。现在队伍还差一个擅长图论或数论的暴力选手。咱们西安本地训练，管饭！',
        competition: 'ACM省赛',
        requiredSkills: ['算法', '图论', 'C++'],
        status: '招募中',
        updatedTime: '刚刚',
        isFavorite: false,
        commentCount: 12,
      }
    ]
    
    list.value.push(...moreData)
    isLoadingMore.value = false
    
    // 为了让你快速看到效果，我们把上限设为 19 条
    // （15条初始 + 4条新加载 = 19条，加载一次就到底）
    if (list.value.length >= 19) {
      hasMore.value = false
      if (observer) observer.disconnect()
    }
  }, 1500)
}

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
  if (item.isFavorite) {
    geekToast.success('已加入我的收藏夹')
  } else {
    geekToast.info('已取消收藏')
  }
}

const sharePost = () => {
  geekToast.success('招募分享链接已复制到剪贴板！')
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
              <button class="action-btn" @click.stop="sharePost(item)">
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

        <!-- 无限滚动指示器 -->
        <div ref="observerTarget" class="infinite-scroll-trigger">
          <div v-if="isLoadingMore" class="loading-state">
            <div class="spinner"></div>
            <span>正在加载更多招募...</span>
          </div>
          <div v-if="!hasMore && !loading" class="end-state">
            没有更多招募信息了，快去自己发布一个吧！
          </div>
        </div>
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

/* 无限滚动加载状态 */
.infinite-scroll-trigger {
  padding: 24px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-fg-muted);
  font-size: 14px;
  border: 1px dashed var(--color-border-default); /* [调试用] 加上虚线框让你看清哨兵位置 */
  margin: 20px 0;
  border-radius: 12px;
  min-height: 100px; /* 给它一个明显的高度，确保哨兵一定能被浏览器看见 */
  background: var(--color-canvas-subtle);
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-default);
  border-top-color: var(--color-accent-fg);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.end-state {
  position: relative;
  padding: 0 40px;
}

.end-state::before, .end-state::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30px;
  height: 1px;
  background: var(--color-border-default);
}
.end-state::before { left: 0; }
.end-state::after { right: 0; }
</style>
