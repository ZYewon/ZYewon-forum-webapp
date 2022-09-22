<template>
  <Layout :show-footer="false">
    <van-nav-bar
      title="我的帖子"
      left-arrow
      @click-left="$router.back"
    ></van-nav-bar>
    <div class="scroll">
      <ul class="list-box">
        <li
          class="list-head flex"
          v-for="item in postList"
          :key="item._id"
          @click="goDetail(item._id)"
        >
          <div class="top">
            <div class="title">
              <div class="type" :class="['type-' + item.catalog]">
                {{ formatCatalog(item.catalog) }}
              </div>
              <span class="ellipsis">{{ item.title }}</span>
            </div>
          </div>
          <div class="bottom">
            <div class="post-reply-created">
              <div class="reply">{{ item.answer }} 回复</div>
              <div class="created">{{ formatDay(item.created) }}</div>
            </div>
            <div class="delete-icon" @click.stop="deletePost(item._id)">
              <van-icon
                name="delete-o"
                size="4.5vw"
                style="margin-top: -10px"
              />
            </div>
          </div>
        </li>
      </ul>
      <Loading
        v-if="!postIsEnd"
        style="text-align: center"
        ref="loadingRef"
      ></Loading>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Layout from "comp/Layout/index.vue";
import { Loading } from "vant";
import formatCatalog from "@/utils/formatCatalog";
import formatDay from "@/utils/formatDay";
import UserStore from "store/modules/user";
import { useObserve } from "@/hooks/useObserve";
const router = useRouter();
const loadingRef = ref<InstanceType<typeof Loading>>();
const pager = {
  pageNum: 1,
  limit: 10,
};
const userStore = UserStore();
let unobserve: any = null;
const observe = (el: HTMLElement) => {
  unobserve = useObserve(el, (item) => {});
};
const getPost = async () => {
  await userStore.getPostList(pager);
  if (!postIsEnd.value) {
    observe(loadingRef.value?.$el);
  } else {
    unobserve && unobserve();
  }
};
const postList = computed(() => userStore.postList);
const postIsEnd = computed(() => userStore.postIsEnd);
onMounted(() => {
  userStore.postList = [];
  getPost();
});
// 跳转至帖子详情
const goDetail = (tid: string) => {
  router.push({
    name: "content",
    params: {
      tid,
    },
  });
};
const deletePost = (tid: string) => {
  userStore.deletePost(tid);
};
</script>

<style scoped lang="scss">
.list-box {
  padding: 30px 30px;
  background-color: #fff;
  margin-bottom: 20px;
}
.list-head {
  /*  display: flex;
  align-items: center; */
  margin-bottom: 18px;
  &.flex {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid #f1f2f3;
    &:last-child {
      border-bottom: none;
    }
  }
  .type {
    display: inline-block;
    height: 36px;
    width: 72px;
    text-align: center;
    line-height: 36px;
    white-space: nowrap;
    margin-right: 10px;
    font-size: 24px;
    border-radius: 18px;
    border-bottom-left-radius: 0;
    color: #fff;
  }
  .type-share {
    background-color: #feb21e;
  }
  .type-ask {
    background-color: #02d199;
  }
  .type-discuss {
    background-color: #fe1e1e;
  }
  .type-advice {
    background-color: #0166f8;
  }
  .title {
    color: #333;
    font-size: 32px;
    line-height: 44px;
    font-weight: bold;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .type {
      min-width: 72px;
      transform: scale(0.9);
      position: relative;
      top: -1px;
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #999;
    align-items: center;
    .post-reply-created {
      display: flex;
      gap: 20px;
      align-items: center;
    }
  }
}
</style>
