<script setup>
defineOptions({
  name: 'LayoutHeader'
})

import LayoutMenu from './LayoutMenu.vue'
import HeaderItem from './HeaderItem.vue'
import HeaderUserInfo from './HeaderUserInfo.vue'

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <LayoutMenu></LayoutMenu>
    </div>
    <div class="header-center">
      <HeaderItem></HeaderItem>
    </div>
    <div class="header-right">
      <HeaderUserInfo></HeaderUserInfo>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  height: 60px;
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border-muted);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 24px;
  max-width: 1440px;
  margin: 0 auto;
  /* 渐变底边线增强质感 */
  box-shadow: 0 1px 0 var(--color-border-default),
              0 2px 20px -8px rgba(0, 0, 0, 0.08);
}

.header-left {
  flex: 0 0 auto;
  margin-right: 12px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 0 0 auto;
  margin-left: 12px;
}

@media screen and (max-width: 768px) {
  .header-container {
    padding: 0 10px;
    gap: 5px;
  }

  .header-left {
    margin-right: 5px;
  }
}
</style>
