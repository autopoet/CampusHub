<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  defaultType: {
    type: String,
    default: 'recruit' // 'recruit' | 'share'
  }
})

const emit = defineEmits(['update:modelValue'])

const isVisible = ref(props.modelValue)
const publishType = ref(props.defaultType)
const form = ref({
  title: '',
  content: '',
  tags: ''
})

watch(() => props.modelValue, (newVal) => {
  isVisible.value = newVal
  if (newVal) {
    publishType.value = props.defaultType
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const closeModal = () => {
  emit('update:modelValue', false)
  // Reset form
  setTimeout(() => {
    form.value = { title: '', content: '', tags: '' }
  }, 300)
}

const handleSubmit = () => {
  console.log('提交发布内容:', { type: publishType.value, ...form.value })
  // Here would be actual API call. We simulate success.
  closeModal()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isVisible" class="publish-modal-overlay" @click.self="closeModal">
        <div class="publish-modal-content">
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          
          <h2 class="modal-title">创作中心</h2>
          <p class="modal-subtitle">分享你的知识，或者寻找并肩作战的极客战友。</p>
          
          <!-- 类型切换 -->
          <div class="type-switch">
            <button 
              class="type-btn" 
              :class="{ active: publishType === 'recruit' }"
              @click="publishType = 'recruit'"
            >
              发起队伍招募
            </button>
            <button 
              class="type-btn" 
              :class="{ active: publishType === 'share' }"
              @click="publishType = 'share'"
            >
              分享干货经验
            </button>
          </div>

          <!-- 极客表单 -->
          <div class="form-container">
            <div class="form-group">
              <input 
                type="text" 
                v-model="form.title" 
                class="geek-input title-input" 
                placeholder="请输入极具吸引力的标题..."
                maxlength="50"
              />
            </div>
            
            <div class="form-group">
              <textarea 
                v-model="form.content" 
                class="geek-input content-input" 
                placeholder="支持 Markdown 语法，写下你想要发布的内容..."
                rows="6"
              ></textarea>
            </div>
            
            <div class="form-group">
              <input 
                type="text" 
                v-model="form.tags" 
                class="geek-input tags-input" 
                placeholder="添加标签 (多个标签请用空格分隔，如: Vue 算法挑战)"
              />
            </div>
          </div>

          <!-- 操作区 -->
          <div class="modal-actions">
            <button class="gh-btn-subtle" @click="closeModal">取消</button>
            <button class="gh-btn-primary glow-btn" @click="handleSubmit">
              <svg class="send-icon" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              立即发布
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 全屏遮罩 - 颜色足够深确保清晰可读 */
.publish-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 核心模态框 - 完全不透明实心背景 */
.publish-modal-content {
  position: relative;
  background: var(--color-canvas-default);
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  padding: 40px;
  border: 1px solid var(--color-border-default);
  /* 加强阴影和轮廓清晰度 */
  box-shadow: 
    0 0 0 1px var(--color-border-default),
    0 25px 60px -12px rgba(0, 0, 0, 0.6),
    0 8px 20px -8px rgba(0, 0, 0, 0.3);
}

/* 渐变发光环境光（只在暗色模式明显） */
[data-theme='dark'] .publish-modal-content::before {
  content: '';
  position: absolute;
  top: -2px; left: -2px; right: -2px; bottom: -2px;
  background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6, transparent 60%);
  border-radius: 22px;
  z-index: -1;
  opacity: 0.3;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 24px; right: 24px;
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--color-btn-hover-bg);
  color: var(--color-fg-default);
  transform: rotate(90deg);
}

/* 标题组 */
.modal-title { font-size: 28px; font-weight: 800; color: var(--color-fg-default); margin-bottom: 8px; letter-spacing: -1px; }
.modal-subtitle { font-size: 14px; color: var(--color-fg-muted); margin-bottom: 32px; }

/* 炫酷类型开关 */
.type-switch {
  display: flex;
  background: var(--color-canvas-subtle);
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 32px;
  border: 1px solid var(--color-border-default);
}
.type-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-fg-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.type-btn.active {
  background: var(--color-canvas-default);
  color: var(--color-accent-fg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 极客表单下划线交互设计 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.geek-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--color-border-default);
  color: var(--color-fg-default);
  font-family: inherit;
  font-size: 15px;
  padding: 8px 0;
  outline: none;
  transition: border-color 0.3s;
}

.geek-input::placeholder {
  color: var(--color-fg-subtle);
}

.geek-input:focus {
  border-bottom-color: var(--color-accent-fg);
}

.title-input {
  font-size: 20px;
  font-weight: 600;
}

.content-input {
  resize: vertical;
  min-height: 120px;
  background: var(--color-canvas-subtle);
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 16px;
}
.content-input:focus {
  background: var(--color-canvas-default);
  border-bottom-color: var(--color-border-default);
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.2);
}

/* 按钮区 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.gh-btn-subtle {
  background: transparent;
  border: none;
  color: var(--color-fg-muted);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 16px;
  transition: color 0.2s;
}
.gh-btn-subtle:hover { color: var(--color-fg-default); }

.gh-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--color-accent-fg), #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.glow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.5);
}

.send-icon {
  transition: transform 0.3s;
}
.glow-btn:hover .send-icon {
  transform: translateX(4px) translateY(-4px);
}

/* 弹窗过渡动画 */
.modal-fade-enter-active, .modal-fade-leave-active { 
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.modal-fade-enter-from, .modal-fade-leave-to { 
  opacity: 0; 
  transform: scale(0.95) translateY(20px); 
}

@media screen and (max-width: 768px) {
  .publish-modal-content {
    padding: 24px;
    height: 100%;
    border-radius: 0;
    max-width: 100%;
    overflow-y: auto;
  }
  .publish-modal-overlay {
    padding: 0;
  }
}
</style>
