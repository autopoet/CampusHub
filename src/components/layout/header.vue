<script setup>
defineOptions({
  name: 'LayoutHeader'
})

import layoutMenu from './menu.vue'
import HeaderItem from './header-item.vue'
import HeaderUserInfo from './header-userinfo.vue'

</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <layoutMenu></layoutMenu>
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
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  max-width: 1440px;
  margin: 0 auto;
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
</style>
