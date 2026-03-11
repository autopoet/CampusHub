<script setup>
import { ref, provide } from 'vue'
import PublishModal from '@/components/ui/PublishModal.vue'

// 全局发布弹窗状态
const isPublishModalVisible = ref(false)
const publishModalType = ref('recruit')

// 提供一个全局方法给所有子孙组件调用
const openPublishModal = (type = 'recruit') => {
  publishModalType.value = type
  isPublishModalVisible.value = true
}

// 核心：使用 Vue 依赖注入将方法暴露给整个应用
provide('openPublishModal', openPublishModal)
</script>

<template>
  <router-view />
  
  <!-- 全局挂载发布弹窗 -->
  <PublishModal 
    v-model="isPublishModalVisible" 
    :default-type="publishModalType" 
  />
</template>

<style scoped>

</style>
