<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="home-catalog">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<style lang="scss">
// 当手机屏幕宽度超过 $break-super: 480px, 横屏浏览时的样式
@media (min-width: $break-super) and (orientation: landscape) {
  html::before {
    width: 100%;
    height: 100%;
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    content: "";
    background: #333;
  }
  body:before {
    background-image: url("./assets/images/orientation.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: 50%;
    content: "";
    height: 200px;
    width: 100px;
    z-index: 99999;
    margin: -140px 0 0 -50px;
    position: absolute;
    color: #fff;
    top: 50%;
    left: 50%;
  }
  body:after {
    content: "\4e3a\4e86\66f4\597d\7684\4f53\9a8c\ff0c\8bf7\5c06\624b\673a\7ad6\8fc7\6765";
    position: absolute;
    top: 50%;
    text-align: center;
    height: 30px;
    left: 0;
    font-size: 18px;
    z-index: 99999;
    width: 100%;
    color: #fff;
    margin-top: 35px;
  }
}
ul,
li {
  padding: 0;
  margin: 0;
}
.scroll {
  flex: 1;
  overflow: auto;
  width: 100%;
}
</style>
