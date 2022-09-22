<template>
  <Layout :show-footer="false" background-color="#f1f2f3">
    <van-nav-bar
      title="签到中心"
      @click-left="$router.back"
      left-arrow
    ></van-nav-bar>
    <div class="scroll sign-container">
      <div class="bg"></div>
      <div class="favs">
        <van-icon
          name="award"
          size="4.5vw"
          color="#e1aa44"
          style="margin-top: -3px"
        />
        <span>可用积分：{{ userinfo.favs }}</span>
      </div>
      <div class="step-sign center">
        <div class="title">已经连续签到 {{ userinfo.count }}天</div>
        <ul class="steps">
          <li v-for="(item, index) in signList">
            <div class="step" :class="{ active: item.isSign }">
              <span class="fav">{{
                item.disabled ? "过时" : "+" + item.fav
              }}</span>
            </div>
            <span>{{ item.name }}</span>
            <div
              v-if="index !== 6"
              class="bar"
              :class="{
                active:
                  item.isSign &&
                  signList[index + 1] &&
                  signList[index + 1].isSign,
              }"
            ></div>
          </li>
        </ul>
        <Button
          @click="signClick"
          type="success"
          block
          :disabled="userinfo.isSign"
          >{{ userinfo.isSign ? "已签到" : "签到" }}</Button
        >
      </div>
      <div class="sign-rules center">
        <div class="title">签到规则</div>
        <span class="rule">1:"签到"可获得的社区积分,规则如下</span>
        <SignRule />
        <span class="rule">2:中间若有间隔,则连续签到天数重新计算</span>
        <span class="rule">3:不可使用程序自动签到,否则积分清零</span>
      </div>
    </div>
  </Layout>
  <div class="sign-success" v-if="isSign">
    <div class="mask"></div>
    <div class="info">
      <div class="title">恭喜您,签到成功!</div>
      <div class="remark">
        恭喜您以获得{{ formatSignFav(userinfo.count) }}积分
      </div>
      <Button block type="success" @click="isSign = false">好的</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import Layout from "comp/Layout/index.vue";
import SignRule from "comp/SignRule/index.vue";
import UserStore from "store/modules/user";
import { Button, Toast } from "vant";
import { getSingWeek, userSign } from "api/user";
import dayjs from "dayjs";

const isSign = ref(false);
const signList = reactive<any[]>([
  {
    name: "周一",
  },
  {
    name: "周二",
  },
  {
    name: "周三",
  },
  {
    name: "周四",
  },
  {
    name: "周五",
  },
  {
    name: "周六",
  },
  {
    name: "周日",
  },
]);
const userStore = UserStore();
const userinfo = computed(() => userStore.userinfo);
const formatSignFav = (count: number) => {
  if (count < 5) {
    return 5;
  } else if (count >= 5 && count < 15) {
    return 10;
  } else if (count >= 15 && count < 30) {
    return 15;
  } else if (count >= 30 && count < 100) {
    return 20;
  } else if (count >= 100 && count < 365) {
    return 30;
  } else if (count >= 365) {
    return 50;
  }
};
// 用户签到
const signClick = async () => {
  const res = await userSign();
  if (res.code === 200) {
    await userStore.initLoginState();
    await getWeekSign();
    isSign.value = true;
  } else {
    Toast.fail({
      message: "签到失败，请稍后再试",
    });
  }
};
const getWeekSign = async () => {
  const res = await getSingWeek();
  res.data.forEach((item: any, index: number) => {
    signList[index].isSign = item.isSign;
    signList[index].disabled = item.disabled;
    signList[index].fav = item.fav;
  });
};
onMounted(() => {
  getWeekSign();
});
getSingWeek();
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
.sign-container {
  position: relative;
  .favs {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .center {
    background-color: #fff;
    width: 90%;
    margin: 0 auto;
    margin-top: -23%;
    border-radius: 15px;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 12;
  }
  .step-sign {
    display: flex;
    flex-direction: column;
    gap: 30px;
    .title {
      font-weight: 600;
      font-size: 32px;
    }
    .steps {
      display: flex;
      justify-content: space-between;
      font-size: 24px;
      color: #999;
      flex: 1;
      li {
        display: flex;
        flex-direction: column;
        gap: 30px;
        position: relative;
        font-size: 24px;
        .step {
          flex-shrink: 0;
          position: relative;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          box-sizing: border-box;
          background-color: #c8f4e8;
          color: #09ac80;
          text-align: center;
          line-height: 50px;
          overflow: hidden;
          &.active {
            background-color: #1cca99;
            box-shadow: 0 0 20px rgba(2, 237, 155, 0.9);
            z-index: 99999;
            &::before {
              content: "✔";
              position: absolute;
              left: 50%;
              top: 50%;
              width: 100%;
              height: 100%;
              background-color: #1cca99;
              transform: translate(-50%, -50%);
              color: #fff;
              width: 100%;
              height: 100%;
              z-index: 12;
            }
          }
          .fav {
            width: 100%;
            height: 100%;
            display: block;
            font-size: 20px;
            transform: scale(0.9);
          }
        }
        .bar {
          position: absolute;
          right: -48px;
          z-index: 33;
          top: 25px;
          width: 50px;
          height: 8px;
          background-color: #cdf3ea;
          border-radius: 20px;
          transition: all 0.3s;
          &.active {
            background-color: #77dcc2;
          }
        }
      }
    }
  }
  .sign-rules {
    margin-top: 30px;
    margin-bottom: 30px;
    .title {
      text-align: center;
      font-weight: 600;
      padding-bottom: 20px;
    }
    .rule {
      display: block;
      color: #000;
      font-size: 28px;
      padding-bottom: 20px;
    }
  }
}

.sign-success {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -70%);
  z-index: 999;
  width: 70%;
  height: 600px;
  .mask {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/sign.png");
    background-repeat: no-repeat;
    background-size: 100% 110%;
    background-position: 0 -50px;
  }
  .info {
    position: absolute;
    width: 75%;
    margin: 0 auto;
    top: 320px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    .title {
      color: #09ac80;
      font-weight: bold;
    }
    .remark {
      font-size: 24px;
      color: #999;
    }
  }
}
</style>
