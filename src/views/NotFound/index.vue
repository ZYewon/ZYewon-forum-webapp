<template>
  <div class="not-found">
    <div class="mask"></div>
    <div class="back-home" @click="goHome">
      <span>返回首页</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.replace({
    name: "home-catalog",
  });
};
</script>

<style scoped lang="scss">
.not-found {
  width: 100%;
  height: 100vh;
  background: #f1f2f3;
  .mask {
    width: 100%;
    height: 50vh;
    background-image: url("@/assets/images/404.png");
    background-size: 100% 100%;
  }
  .back-home {
    width: 300px;
    height: 100px;
    margin: 0 auto;
    text-align: center;
    line-height: 100px;
    background: #02d199;
    color: #fff;
    border-radius: 30px;
    font-size: 28px;
    &:active {
      background: #09ac80;
    }
  }
}
</style>
