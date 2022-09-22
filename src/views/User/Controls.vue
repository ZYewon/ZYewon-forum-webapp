<template>
  <!-- 注册和忘记密码 -->
  <div class="form-controls">
    <router-link :to="{ name: leftPathName }">{{ leftText }}</router-link>
    <router-link :to="{ name: rightPathName }">{{ rightText }}</router-link>
  </div>
</template>

<script setup lang="ts">
defineProps({
  leftText: String,
  rightText: String,
  leftPathName: String,
  rightPathName: String,
});
</script>

<style scoped lang="scss">
.form-controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 40px;
  box-sizing: border-box;
  padding: 0 20px;
  a {
    color: #9f9f9f;
    font-size: 30px;
    &:active {
      color: #4fc08d;
    }
  }
}
</style>
