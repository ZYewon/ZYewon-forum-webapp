<template>
  <Tabbar :model-value="name" active-color="#3ebd9c" inactive-color="#c1c1c1">
    <tabbar-item replace to="/" name="home" icon="home-o">首页</tabbar-item>
    <tabbar-item
      replace
      to="/msg/reply"
      name="msg"
      icon="chat-o"
      :badge="num ? (num.message ? num.message : null) : null"
    >
      消息
    </tabbar-item>
    <tabbar-item replace to="/hot/post" name="hot" icon="fire-o">
      热门
    </tabbar-item>
    <tabbar-item replace to="/user" name="person" icon="manager-o">
      我的
    </tabbar-item>
  </Tabbar>
</template>

<script lang="ts" setup name="my-footer">
import { inject, computed } from "vue";
import WsStore from "store/modules/ws";
import { Tabbar, TabbarItem } from "vant";
const name = inject("name", "home");
const wsStore = WsStore();
const num = computed(() => wsStore.num);
</script>

<style scoped lang="scss">
@import "assets/styles/_mixin.scss";

.van-tabbar.van-tabbar--fixed.van-hairline--top-bottom.van-safe-area-bottom {
  @include resH-to(medium-screens) {
    padding-bottom: 28px;
  }
  @include resH-to(big-screens) {
    padding-bottom: 28px;
  }
}
</style>
