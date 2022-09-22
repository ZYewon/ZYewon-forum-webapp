<template>
  <Layout>
    <van-nav-bar title="热门"></van-nav-bar>
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
    <div class="tab-type">
      <ul v-if="container[type]">
        <li
          @click="setIndex(index)"
          v-for="(item, index) in container[type]"
          :class="{ active: currentIndex === index }"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="tab-content scroll">
      <ul class="content-box" v-if="type === 'post'">
        <template v-if="postList.length > 0">
          <li class="content-item" v-for="(item, index) in postList">
            <div
              class="count"
              :class="{
                first: index === 0,
                second: index === 1,
                third: index === 2,
              }"
            >
              {{ index < 9 ? "0" + (index + 1) : index + 1 }}
            </div>
            <div class="column">
              <div class="title">
                {{ item.title }}
              </div>
              <div class="read">{{ item.answer }} 评论</div>
            </div>
            <div class="img">
              <img
                :src="item.uid ? item.uid.pic : `/img/bear-200-200.jpg`"
                alt=""
              />
            </div>
          </li>
        </template>
        <template v-else>
          <li class="no-sign-list">近日内没有热门帖子呢...</li>
        </template>
      </ul>
      <ul class="content-box" v-else-if="type === 'comments'">
        <li
          class="content-item flex-start"
          v-for="(item, index) in commentsList"
        >
          <div
            class="count"
            :class="{
              first: index === 0,
              second: index === 1,
              third: index === 2,
            }"
          >
            {{ index < 9 ? "0" + (index + 1) : index + 1 }}
          </div>
          <div class="info">
            <div class="avatar">
              <img
                :src="item.cuid ? item.cuid.pic : `/img/bear-200-200.jpg`"
                alt=""
              />
            </div>
            <div class="info-desc">
              <div class="nickname">
                {{ item.cuid ? item.cuid.nickname : "未知用户" }}
              </div>
              <p v-if="currentIndex === 0">
                <em>{{ item.count }}</em> 条评论
              </p>
              <p v-else-if="currentIndex === 1">
                {{ formatDay(item.created) }}&nbsp;发表了评论
              </p>
            </div>
          </div>
        </li>
      </ul>
      <ul class="content-box" v-if="type === 'sign'">
        <template v-if="signList.length > 0">
          <li
            class="content-item flex-start"
            v-for="(item, index) in signList"
            :key="item._id"
          >
            <div
              class="count"
              :class="{
                first: index === 0,
                second: index === 1,
                third: index === 2,
              }"
            >
              {{ index < 9 ? "0" + (index + 1) : index + 1 }}
            </div>
            <div class="info">
              <div class="avatar">
                <img
                  :src="
                    item.pic
                      ? item.pic
                      : item.uid
                      ? item.uid.pic
                      : `/img/bear-200-200.jpg`
                  "
                  alt=""
                />
              </div>
              <div class="info-desc">
                <div class="nickname">
                  {{
                    item.nickname
                      ? item.nickname
                      : item.uid
                      ? item.uid.nickname
                      : "未知用户"
                  }}
                </div>
                <p v-if="currentIndex === 1">{{ formatDay(item.created) }}</p>
                <p v-else-if="currentIndex === 0">
                  累计签到 <em>{{ item.count }}</em> 次
                </p>
              </div>
            </div>
          </li>
        </template>
        <template v-else>
          <li class="no-sign-list">今天还没有人签到呢...</li>
        </template>
      </ul>
      <Loading
        v-if="!isEnd"
        ref="loadingRef"
        style="text-align: center"
      ></Loading>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { provide, ref, watch } from "vue";
import Layout from "comp/Layout/index.vue";
import { getHotComments, getHotPost, getHotSignRecord } from "api/hot";
import formatDay from "@/utils/formatDay";
import { Loading } from "vant";
import { sign } from "crypto";
import { useObserve } from "@/hooks/useObserve";
provide("name", "hot");
const props = defineProps(["type"]);
const currentIndex = ref(0);
const postList = ref<any[]>([]);
const commentsList = ref<any[]>([]);
const signList = ref<any[]>([]);
const isEnd = ref(false);
const routes = [
  { path: "/hot/post", name: "热门帖子" },
  { path: "/hot/comments", name: "热门评论" },
  { path: "/hot/sign", name: "签到排行" },
];
const container: any = {
  post: ["3日内", "7日内", "30日内", "全部"],
  comments: ["热门评论", "最新评论"],
  sign: ["总签到榜", "今日签到榜"],
};
const pager = {
  pageNum: 1,
  limit: 10,
};
const loadingRef = ref<InstanceType<typeof Loading>>();
// 重置关于请求的模板渲染的数据
const reset = () => {
  pager.pageNum = 1;
  pager.limit = 10;
  isEnd.value = false;
  postList.value = [];
  commentsList.value = [];
  signList.value = [];
  typeHandler();
};
const setIndex = (index: number) => {
  currentIndex.value = index;
  reset();
};
// 获取热门帖子
const _getHotPost = async () => {
  const res = await getHotPost({
    type: props.type,
    index: currentIndex.value,
    ...pager,
  });
  if (res.code === 200) {
    if (postList.value.length === 0) {
      postList.value = res.data.list;
    } else {
      postList.value.push(...res.data.list);
    }

    if (postList.value.length >= res.data.total) {
      isEnd.value = true;
    }
  }
};
// 获取热门评论
const _getHotComments = async () => {
  const res = await getHotComments({
    type: props.type,
    index: currentIndex.value,
    ...pager,
  });

  if (res.code === 200) {
    if (commentsList.value.length === 0) {
      commentsList.value = res.data.list;
    } else {
      commentsList.value.push(...res.data.list);
    }
    if (commentsList.value.length >= res.data.total) {
      isEnd.value = true;
    }
  }
};
// 获取签到排行
const _getHotSignRecord = async () => {
  const res = await getHotSignRecord({
    index: currentIndex.value,
    ...pager,
  });
  if (res.code === 200) {
    if (signList.value.length === 0) {
      signList.value = res.data.list;
    } else {
      signList.value.push(...res.data);
    }
    if (signList.value.length >= res.data.total) {
      isEnd.value = true;
    }
  }
};
// 监听 loading 动画，加载下一页
let unobserve: any = null;
const observer = (el: HTMLElement) => {
  unobserve = useObserve(el, (item) => {
    pager.pageNum++;
    typeHandler();
  });
};
// 根据 url type 发起对应的请求
const typeHandler = async () => {
  // 再重新发送请求时先停止监听
  unobserve && unobserve();
  const handlers: any = {
    post: _getHotPost,
    comments: _getHotComments,
    sign: _getHotSignRecord,
  };
  await handlers[props.type]();
  // 然后重新监听loading状态
  if (!isEnd.value) {
    observer(loadingRef.value?.$el);
  } else {
    unobserve && unobserve();
  }
};
watch(
  () => props.type,
  () => {
    currentIndex.value = 0;
    reset();
  },
  {
    immediate: true,
  }
);
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

.tab-type {
  padding: 0 20px 10px 20px;
  flex-shrink: 0;

  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    li {
      background-color: rgba(243, 243, 243, 1);
      color: #999;
      font-size: 26px;
      font-weight: bold;
      height: 50px;
      line-height: 50px;
      padding: 0 35px;
      border-radius: 20px;
      margin-right: 25px;
      margin-top: 15px;
      &.active {
        background-color: rgba(2, 209, 153, 0.16);
        color: rgba(2, 209, 153, 1);
      }
    }
  }
}

.content-box {
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  .no-sign-list {
    text-align: center;
    color: #999;
    margin-top: 50px;
    font-size: 24px;
  }
  .content-item {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f2f3;
    margin-bottom: 10px;
    &.flex-start {
      justify-content: flex-start;
      gap: 20px;
    }
    &:last-child {
      border-bottom: none;
    }
    .count {
      font-size: 36px;
      font-weight: bold;
      color: #999;
      &.first {
        color: #ed745e;
      }
      &.second {
        color: #e08435;
      }
      &.third {
        color: #f1ae37;
      }
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: nowrap;
      height: 110px;
      padding: 35px 30px;
      gap: 15px;
      .title {
        font-size: 32px;
        color: #333;
        font-weight: bold;
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
    .img {
      flex-shrink: 0;
      width: 150px;
      height: 150px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 12px;
      }
    }
    .info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 35px 0;
      .avatar {
        width: 100px;
        height: 100px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info-desc {
        display: flex;
        flex-direction: column;
        gap: 25px;
        overflow: hidden;
        .nickname {
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p {
          margin: 0;
          font-size: 24px;
          color: #999;
          em {
            font-style: normal;
            font-weight: bold;
            font-size: 26px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
