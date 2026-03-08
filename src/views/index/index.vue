<script setup>
defineOptions({
  name: 'IndexView'
})

import IndexLeft from './indexleft.vue'
import IndexRight from './indexright.vue'
</script>

<template>
  <div class="index-container">
    <div class="index-left">
      <IndexLeft></IndexLeft>
    </div>
    <div class="index-right">
      <IndexRight></IndexRight>
    </div>
  </div>
</template>

<style scoped>
.index-container {
  display: flex;
  gap: 20px;
  padding: 20px 0;
}

.index-left {
  flex: 1;
}

.index-right {
  flex: 0 0 300px;
}
</style>
