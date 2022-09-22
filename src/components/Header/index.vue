<template>
  <div class="header">
    <div class="head-left" @click="goBack" v-if="hasBack">
      <slot name="h-left">
        <van-icon name="arrow-left" />
        <span class="left-text" v-if="backText !== ''">{{ backText }}</span>
      </slot>
    </div>
    <div class="head-content">
      <slot name="h-center">
        <span class="left-text">{{ title }}</span>
      </slot>
    </div>
    <div class="head-right">
      <slot name="h-right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup name="my-header">
import { withDefaults } from "vue";
import { useRouter } from "vue-router";
const props = withDefaults(
  defineProps<{
    title: string;
    backText: string;
    back?: () => void;
    bkColor?: string;
    hasBack?: boolean;
    zIndex?: number;
  }>(),
  {
    title: "",
    backText: "返回",
    hasBack: true,
    zIndex: 100,
  }
);
const router = useRouter();
const goBack = () => {
  if (props.back) {
    props.back();
    return;
  }
  router.back();
};
</script>

<style scoped lang="scss">
.header {
  background-color: v-bind(bkColor);
  z-index: v-bind(zIndex);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: $header-height;
  font-size: 16px;
  line-height: $header-height;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .head-left,
  .head-right {
    position: absolute;
    top: 0;
    padding: 0 10px;
  }
  .head-left {
    left: 0;
  }
  .head-right {
    right: 0;
  }
  .head-content {
    max-width: 60%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
  }
}
</style>
