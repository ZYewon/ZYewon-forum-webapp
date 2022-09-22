<template>
  <Layout :show-footer="false">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="$router.back"
    ></van-nav-bar>
    <Collect :collectList="collectList" @deleteClick="deleteClick">
      <Loading
        v-if="!collectIsEnd"
        ref="loadingRef"
        style="text-align: center"
      ></Loading>
    </Collect>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Loading } from "vant";
import Layout from "comp/Layout/index.vue";
import Collect from "comp/Collect/index.vue";
import UserStore from "store/modules/user";
import { useObserve } from "@/hooks/useObserve";
const userStore = UserStore();
const loadingRef = ref<InstanceType<typeof Loading>>();
const pager = {
  pageNum: 1,
  limit: 10,
};
let unobserve: any = null;
const observer = (el: HTMLElement) => {
  unobserve = useObserve(el, () => {
    pager.pageNum++;
    getCollect();
  });
};
const collectList = computed(() => userStore.collectList);
const collectIsEnd = computed(() => userStore.collectIsEnd);
const getCollect = async () => {
  userStore.collectList = [];
  await userStore.getCollectList(pager);
  if (!collectIsEnd.value) {
    observer(loadingRef.value?.$el);
  } else {
    unobserve && unobserve();
  }
};
onMounted(() => {
  getCollect();
});
// 取消收藏
const deleteClick = (id: string) => {
  userStore.cancelCollect(id);
};
</script>

<style scoped lang="scss"></style>
