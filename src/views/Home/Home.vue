<template>
  <layout>
    <!--  <my-header title="首页"></my-header>-->
    <Search
      v-model="value"
      placeholder="搜索社区内容"
      show-action
      action-text="确认"
      shape="round"
    />
    <Tabs />

    <div class="rw bc">
      <router-view></router-view>
    </div>
  </layout>
</template>

<script lang="ts" setup>
import Layout from "comp/Layout/index.vue";
import { ref } from "vue";
import { Search } from "vant";
import Tabs from "./Tabs.vue";
const value = ref("");
</script>

<style scoped lang="scss">
.rw {
  flex: 1;
  overflow: auto;
}
.bc {
  background-color: #f3f6f8;
}
</style>
