<template>
  <ul class="tab">
    <router-link
      class="item"
      :to="item.path"
      v-for="(item, index) in tabs"
      :key="'tabs' + index"
      exact-active-class="active"
      ><span class="txt">{{ item.name }}</span></router-link
    >
  </ul>
</template>

<script lang="ts" setup>
const tabs = [
  { name: "首页", path: "/" },
  { name: "提问", path: "/index/ask" },
  { name: "建议", path: "/index/advice" },
  { name: "分享", path: "/index/share" },
  { name: "讨论", path: "/index/discuss" },
];
</script>

<style scoped lang="scss">
@import "./tabs.scss";
</style>
