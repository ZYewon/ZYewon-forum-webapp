<template>
  <div
    class="wrapper"
    :style="{ height: innerHeight, backgroundColor: backgroundColor }"
  >
    <slot></slot>
    <my-footer ref="footer" v-if="showFooter" />
  </div>
</template>
<script name="layout" setup lang="ts">
import MyFooter from "comp/Footer/index.vue";
import { onMounted, ref } from "vue";
const props = defineProps({
  backgroundColor: {
    type: String,
    default: "#fff",
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
});
const footer = ref<InstanceType<typeof MyFooter>>();
const innerHeight = ref<any>();
const subPx = ref<number>(50);
onMounted(() => {
  if (props.showFooter) {
    subPx.value = footer.value?.$el.clientHeight;
    innerHeight.value = `calc(100vh - ${subPx.value}px)`;
  } else {
    innerHeight.value = `calc(100vh)`;
  }
});
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
</style>
