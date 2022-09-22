<template>
  <Layout>
    <van-nav-bar title="消息"></van-nav-bar>
    <ul class="links">
      <router-link
        :to="item.path"
        custom
        v-slot="{ navigate, isExactActive }"
        v-for="item in routes"
        :key="item.path"
      >
        <li @click="navigate" :class="{ active: isExactActive }">
          {{ item.name }}
        </li>
      </router-link>
    </ul>
    <div class="scroll">
      <PullRefresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
      >
        <ul class="content-box">
          <template v-if="type === 'reply'">
            <li v-for="item in msgList">
              <!-- 用户信息 -->
              <div class="content-item">
                <div class="flex">
                  <img
                    class="user"
                    :src="item.cuid ? item.cuid.pic : `/img/bear-200-200.jpg`"
                    alt=""
                  />
                  <div class="column">
                    <div class="title">
                      {{ item.cuid ? item.cuid.nickname : "未知用户" }}
                    </div>
                    <div class="read">
                      {{ formatDay(item.created) }} 回复了你
                    </div>
                  </div>
                </div>
                <div class="reply">
                  <van-icon name="edit" size="4.2vw" />
                  <span>回复</span>
                </div>
              </div>
              <div
                class="reply-content"
                v-html="escapeHtml(item.content)"
              ></div>
              <!-- 帖子的缩略内容 -->
              <div class="page" @click="goDetail(item)">
                <div class="title">{{ item.tid ? item.tid.title : "" }}</div>
                <div
                  class="desc"
                  v-html="escapeHtml(item.tid ? item.tid.content : '')"
                ></div>
              </div>
            </li>
          </template>
          <template v-else>
            <li v-for="item in 10">
              <!-- 用户信息 -->
              <div class="content-item">
                <div class="flex">
                  <img class="user" src="/img/bear-200-200.jpg" alt="" />
                  <div class="column">
                    <div class="title">用户名称</div>
                    <div class="read">一分钟前 赞了你的帖子</div>
                  </div>
                </div>
              </div>
              <!-- 帖子的缩略内容 -->
              <div class="page">
                <div class="title no-pd">帖子标题</div>
              </div>
            </li>
          </template>
          <Loading
            v-if="!isEnd"
            ref="loadingRef"
            style="text-align: center"
          ></Loading>
        </ul>
      </PullRefresh>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { provide, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { PullRefresh, Toast, Loading } from "vant";
import { getMsg, setMsg } from "api/user";
import formatDay from "@/utils/formatDay";
import escapeHtml from "@/utils/escapeHtml";
import WsStore from "store/modules/ws";
import Layout from "comp/Layout/index.vue";
const props = defineProps(["type"]);
provide("name", "msg");
const routes = [
  { name: "回复", path: "/msg/reply" },
  { name: "点赞", path: "/msg/hands" },
];
const pager = {
  pageNum: 1,
  limit: 10,
};
const isLoading = ref(false);
const msgList = ref<any[]>([]);
const isEnd = ref(false);
const handsList = ref<any[]>([]);
const loadingRef = ref<InstanceType<typeof Loading>>();
const dispatch = async () => {
  const handlers: any = {
    reply: _getMsg,
    hands: _getHands,
  };
  await handlers[props.type]();
};
onMounted(() => {
  dispatch();
});
// 下拉刷新
const onRefresh = async () => {
  await dispatch();
  isLoading.value = false;
};
const _getMsg = async () => {
  const res = await getMsg(pager);
  if (res.code === 200) {
    if (msgList.value.length === 0) {
      msgList.value = res.data;
    } else {
      msgList.value.push(...res.data);
    }
    if (msgList.value.length >= res.total) {
      isEnd.value = true;
    }
  } else {
    Toast.fail({
      message: res.msg,
    });
  }
};
const _getHands = async () => {};
watch(
  () => props.type,
  () => {
    msgList.value = [];
    handsList.value = [];
    pager.pageNum = 1;
    pager.limit = 10;
    isEnd.value = false;
    dispatch();
  }
);

// 当用户从消息页面跳转至某一个帖子时将该消息设置为已读状态
const wsStore = WsStore();
const _setMsg = async (item: any) => {
  await setMsg({
    cid: item._id,
  });
  wsStore.num.message--;
};
const router = useRouter();
const goDetail = (item: any) => {
  _setMsg(item);
  router.push({
    name: "content",
    params: {
      tid: item.tid._id,
    },
  });
};
</script>

<style scoped lang="scss">
.links {
  width: 100%;
  height: $header-height;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #666;
  font-size: 28px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  li {
    position: relative;
    &.active {
      color: $primary-color;

      &::after {
        content: "";
        position: absolute;
        bottom: -18px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 4px;
        background-color: $primary-color;
      }
    }
  }
}
.content-box {
  padding: 0 20px 30px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-sizing: border-box;
  .content-item {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 10px;
    &.pd {
      padding: 20px 0;
    }
    .flex {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      &.heads::after {
        content: "赞了你的帖子";
        position: absolute;
        bottom: 0px;
        font-size: 28px;
      }
      .user {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }

    &:last-child {
      border-bottom: none;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: nowrap;
      height: 110px;
      padding: 35px 15px;
      gap: 15px;
      .title {
        flex-shrink: 0;
        font-size: 32px;
        font-weight: bold;
        color: #333;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 这里是超出几行省略 */
        overflow: hidden;
      }
      .read {
        font-size: 26px;
        color: #999;
      }
    }

    .reply {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      color: #999;
    }
  }
  .reply-content {
    font-size: 28px;
    margin-top: -30px;
    padding: 0 20px 30px 20px;

    color: #666;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .page {
    background-color: #f3f3f3;
    border-radius: 12px;
    padding: 15px 30px;
    .title {
      font-size: 26px;
      color: #333;
      padding-bottom: 15px;
      font-weight: bold;
      &.no-pd {
        padding: 0;
      }
    }
    .desc {
      font-size: 24px;
      color: #999;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-all;
      line-height: 32px;
    }
  }
}
</style>
