<template>
  <layout background-color="#f0eef1">
    <van-nav-bar title="个人中心"></van-nav-bar>
    <div class="bg"></div>
    <div class="user-container">
      <div class="user-top">
        <div class="avatar">
          <img
            :src="userinfo.pic ? userinfo.pic : `/img/bear-200-200.jpg`"
            alt=""
          />
        </div>
        <div class="center">
          <div class="user-nickname">
            {{ userinfo.nickname ? userinfo.nickname : "请登录" }}
          </div>
          <div class="user-favs" v-if="userinfo.favs">
            <van-icon name="award" size="4vw" />
            <span> 积分：{{ userinfo.favs }} </span>
          </div>
        </div>
        <div class="right">
          <router-link to="/my">
            个人主页
            <van-icon name="arrow" />
          </router-link>
        </div>
      </div>
      <ul class="user-bottom">
        <router-link :to="{ name: 'mypost' }" v-slot="{ navigate }">
          <li class="item" @click="navigate">
            <div class="count">{{ total }}</div>
            <div class="desc">我的帖子</div>
          </li>
        </router-link>
        <router-link :to="{ name: 'mycollect' }" v-slot="{ navigate }">
          <li class="item" @click="navigate">
            <div class="count">{{ collectTotal }}</div>
            <div class="desc">收藏夹</div>
          </li>
        </router-link>
        <li class="item">
          <div class="count">0</div>
          <div class="desc">最近浏览</div>
        </li>
      </ul>
    </div>
    <div class="center-wrapper">
      <ul class="center-list">
        <li
          v-for="item in lists"
          :key="item.name"
          @click="goTo(item.routeName)"
        >
          <van-icon
            :name="item.icon"
            class="icon"
            size="6vw"
            :color="item.color"
          />
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <ul class="center-list">
        <router-link
          :to="item.path"
          v-for="item in routes"
          :key="item.path"
          v-slot="{ navigate }"
          custom
        >
          <li @click="navigate">
            <van-icon :name="item.icon" class="icon" size="6vw" />
            <span>{{ item.name }}</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div class="pd20" v-if="userStore.isLogin">
      <Button type="danger" block round @click="logout">退出登录</Button>
    </div>
  </layout>
</template>

<script setup lang="ts">
import { provide, computed } from "vue";
import { useRouter } from "vue-router";
import { Button, Dialog } from "vant";
import UserStore from "store/modules/user";
import Layout from "comp/Layout/index.vue";

const lists = [
  {
    name: "我的帖子",
    routeName: "mypost",
    icon: "description",
    color: "#f84d41",
  },
  {
    name: "修改设置",
    routeName: "settings",
    icon: "setting-o",
    color: "#e47917",
  },
  {
    name: "修改密码",
    routeName: "setpasswd",
    icon: "shield-o",
    color: "#51a6e8",
  },
  { name: "签到中心", routeName: "sign", icon: "sign", color: "#ee7704" },
  {
    name: "购买记录",
    routeName: "products",
    icon: "balance-o",
    color: "#f08d1d",
  },
  { name: "赞助商", routeName: "sponsors", icon: "medal-o", color: "#3ca1ee" },
];
const routes = [
  { name: "提问", path: "/index/ask", icon: "comment-o" },
  { name: "分享", path: "/index/share", icon: "share-o" },
  { name: "讨论", path: "/index/discuss", icon: "friends-o" },
  { name: "建议", path: "/index/advice", icon: "smile-o" },
];
const userStore = UserStore();
const router = useRouter();
provide("name", "person");
const goTo = (name: string) => {
  router.push({
    name,
  });
};
const userinfo = computed(() => userStore.userinfo);
if (userStore.isLogin) {
  userStore.postList = [];
  userStore.getPostList();
  userStore.collectList = [];
  userStore.getCollectList();
}
const total = computed(() => userStore.total);
const collectTotal = computed(() => userStore.collectTotal);
// 退出登录
const logout = async () => {
  try {
    await Dialog.confirm({
      title: "提示",
      message: "确定要退出登陆吗？",
    });
    await userStore.logout();
  } catch (e) {}
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
.user-container {
  position: relative;
  z-index: 1;
  width: 90%;
  margin: -210px auto 0;
  background-color: #fff;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 40px;
  .user-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar {
      flex-shrink: 0;
      width: 120px;
      height: 120px;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      padding-left: 20px;
      overflow: hidden;

      .user-nickname {
        display: inline-block;
        width: 90%;
        font-weight: bold;
        font-size: 36px;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-favs {
        display: inline-block;
        background-color: rgba(2, 299, 153, 0.16);
        font-size: 12px;
        border-radius: 12px;
        color: #6ac9af;
        padding: 4px 12px;
        span {
          padding-left: 10px;
        }
      }
    }
    .right {
      a {
        font-size: 24px;
        color: #666;
      }
    }
  }
  .user-bottom {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;
      position: relative;
      &:not(:last-child)::after {
        content: "";
        width: 2px;
        height: 80px;
        background-color: #ddd;
        position: absolute;
        right: -50px;
        top: 0px;
      }

      .count {
        font-size: 36px;
        font-weight: bold;
        color: $font-main-color;
      }
      .desc {
        color: #666;
        font-size: 14px;
      }
    }
  }
}
.center-wrapper {
  // background-color: #f6f5f8;
  width: 100%;
  margin-top: 30px;
  .center-list {
    width: 100%;
    background-color: #fff;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    border-radius: 10px 10px 0 0;
    li {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #666;
      font-size: 26px;
      gap: 20px;
      padding: 40px 0;
      &:last-child:nth-child(4n + 2) {
        margin-right: calc((100% - 25%) / 3 * 2);
      }
      &:last-child:nth-child(4n + 3) {
        margin-right: calc((100% - 25%) / 3 * 1);
      }
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        color: #888;
      }
    }
  }
}
.pd20 {
  padding: 0 40px;
}
</style>
