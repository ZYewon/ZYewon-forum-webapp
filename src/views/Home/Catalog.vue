<template>
  <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <List
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了。。"
      @load="onLoad"
    >
      <ul class="list">
        <ListItem
          v-for="item in postList"
          :key="item._id"
          :item="item"
          @onShowUser="goUser"
          @onShowDetail="goDetail"
        ></ListItem>
      </ul>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts" name="home-catalog">
import { reactive, ref, watch } from "vue";
import { List, PullRefresh, Toast } from "vant";
import { getListAsync } from "api/content";
import ListItem from "comp/ListItem/index.vue";
import { useRouter } from "vue-router";
const props = defineProps(["catalog"]);
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const postList = ref<any[]>([]);
let isRequest = false;
// 分页参数
const pager = reactive({
  page: 1,
  limit: 10,
});

const total = ref<number>(0);
const getList = async () => {
  if (isRequest) return;
  isRequest = true;
  finished.value = false;
  const res = await getListAsync({
    ...pager,
    catalog: props.catalog,
    sort: "created",
  });
  if (res.code === 200) {
    if (postList.value.length === 0) {
      postList.value = res.data;
    } else {
      postList.value.push(...res.data);
    }
    total.value = res.total;
    if (postList.value.length >= total.value) {
      setFinishedState(true);
    }
  }
  isRequest = false;
};

const setFinishedState = (bol: boolean) => {
  finished.value = bol;
  loading.value = !bol;
};
const resetParams = () => {
  pager.page = 1;
  total.value = 0;
  postList.value = [];
};
// 下拉刷新
const onRefresh = async () => {
  resetParams();
  setFinishedState(false);
  await getList();
  refreshing.value = false;
};
// 滚动到底部时触发
const onLoad = async () => {
  if (postList.value.length < total.value) {
    pager.page++;
  }
  await getList();
};
watch(
  () => props.catalog,
  async () => {
    resetParams();
    await getList();
  }
);
const router = useRouter();
const goUser = () => {};
const goDetail = (tid: string) => {
  router.push({
    name: "content",
    params: {
      tid,
    },
  });
};
</script>

<style scoped lang="scss">
.list {
  padding: 0;
  margin: 0;
}
</style>
