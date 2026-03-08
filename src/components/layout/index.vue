<script setup>
import LayoutHeader from './header.vue';

</script>

<template>
  <div>
    <el-container>
      <el-header>
        <LayoutHeader></LayoutHeader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>
