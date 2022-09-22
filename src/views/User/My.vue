<template>
  <Layout :show-footer="false">
    <van-nav-bar
      title="个人主页"
      left-arrow
      @click-left="$router.back"
    ></van-nav-bar>
    <div class="scroll">
      <div class="bg"></div>
      <div class="info">
        <div class="avatar">
          <img :src="userinfo.pic || `/img/bear-200-200.jpg`" alt="" />
        </div>
        <div class="nickname">{{ userinfo.nickname || "请登录" }}</div>
        <div class="remark">{{ userinfo.remark || "" }}</div>
      </div>
      <ul class="my-operate mt50">
        <li>
          <span>{{ totals.commentsTotal }}</span>
          <span>评论</span>
        </li>
        <li>
          <span>{{ totals.handsTotal }}</span>
          <span>点赞</span>
        </li>
        <li>
          <span>{{ totals.collectTotal }}</span>
          <span>收藏</span>
        </li>
        <li>
          <span>0</span>
          <span>获赞</span>
        </li>
      </ul>
      <ul class="tab mt50">
        <li
          class="tab-item"
          :class="{ active: currentIndex === 0 }"
          @click="setIndex(0)"
        >
          动态
        </li>
        <li
          class="tab-item"
          :class="{ active: currentIndex === 1 }"
          @click="setIndex(1)"
        >
          资料
        </li>
      </ul>
      <div v-if="currentIndex === 0">
        <span class="van-empty" style="color: #999">暂无动态</span>
      </div>
      <div v-else-if="currentIndex === 1" class="pd20">
        <p>基本信息</p>
        <div class="info-user">
          <span>性别</span>
          <em>{{
            userinfo.gender ? (+userinfo.gender === "0" ? "男" : "女") : "女"
          }}</em>
        </div>
        <div class="info-user">
          <span>家乡</span>
          <em>{{ userinfo.location || "未填写" }}</em>
        </div>
        <div class="info-user">
          <span>职业</span>
          <em>未填写</em>
        </div>
        <div class="info-user">
          <span>社龄</span>
          <em>{{ dayjs().format("YYYY-MM-DD") }}</em>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Toast } from "vant";
import Layout from "comp/Layout/index.vue";
import UserStore from "store/modules/user";
import { getMyPageTotal } from "api/user";
import Collect from "comp/Collect/index.vue";
import dayjs from "dayjs";
const currentIndex = ref(0);
const userStore = UserStore();
const userinfo = computed(() => userStore.userinfo);
const postList = computed(() => userStore.postList);
const totals = ref<any>({});
const pager = {
  pageNum: 1,
  limit: 10,
};
const getMyPageTotalAsync = async () => {
  const res = await getMyPageTotal();
  if (res.code === 200) {
    totals.value = res.data;
  } else {
    Toast.fail({
      message: res.msg,
    });
  }
};
const getMyPostList = async () => {
  await userStore.getPostList(pager);
};
onMounted(() => {
  getMyPageTotalAsync();
  getMyPostList();
});
const setIndex = (index: number) => {
  currentIndex.value = index;
};
</script>

<style scoped lang="scss">
.bg {
  height: 260px;
  // 左上、右上、右下、左下
  border-radius: 0 0 50% 50%;
  background-color: $user-page-color;
  position: relative;
  z-index: 0;
}
.info {
  position: relative;
  z-index: 2;
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-top: -18%;
  padding: 40px;
  box-sizing: border-box;
  text-align: center;
  .avatar {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    margin-top: -75px;
    overflow: hidden;
    border: 10px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .nickname {
    font-weight: bold;
    padding: 20px 0;
  }
  .remark {
    font-size: 24px;
    color: #999;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
.mt50 {
  margin-top: 50px;
}
.mt80 {
  margin-top: 80px;
}
.my-operate {
  display: flex;
  justify-content: space-around;

  li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    font-size: 28px;
  }
}
.tab {
  display: flex;
  justify-content: space-around;
  font-size: 28px;
  padding: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  li {
    position: relative;
    &.active {
      color: $primary-color;
      &::after {
        content: "";
        width: 50%;
        height: 4px;
        background-color: $primary-color;
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 10px;
      }
    }
  }
}
.pd20 {
  padding: 40px;
}
.info-user {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 28px;
  margin-bottom: 40px;
  em {
    font-style: initial;
    color: #999;
    font-size: 24px;
  }
}
</style>
