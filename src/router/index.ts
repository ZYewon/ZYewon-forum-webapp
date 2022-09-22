import { createRouter, createWebHistory } from "vue-router";
import { isEmpty } from "@/utils";
import { Dialog } from "vant";
import UserStore from "store/modules/user";
import routes from "./routes";
const router = createRouter({
  routes,
  history: createWebHistory(),
});
const less = ["login", "reg", "forget"];

router.beforeEach(async (to, from, next) => {
  const userStore = UserStore();
  // 1. 如果 token 为空
  if (isEmpty(userStore.token)) {
    // 1.1 如果跳转的地方需要登录才能够进行访问，则弹出确认框提示用户是否登录
    if (to.matched.some((item) => item.meta.requireAuth)) {
      try {
        await Dialog.confirm({
          title: "提示",
          message: "您还未登录，需要登陆吗？",
        });
        localStorage.setItem("route", JSON.stringify(from));
        // 点击了确认就跳转到登陆页面
        next({ name: "login" });
      } catch (e) {
        // 点击了取消
        next(false);
      }
    } else {
      next();
    }
  } else {
    // 2. 有 token 的情况下,则先判断是否是登陆状态
    const isLogin = userStore.isLogin;
    // 2.1 如果不是登陆状态，则有可能刷新了页面
    if (!isLogin) {
      await userStore.initLoginState(); // 获取用户信息，更新登陆状态
      if (!userStore.isLogin) {
        // 如果还是未登录的状态，则代表 token 过期，或 token 不正确
        if (to.matched.some((item) => item.meta.requireAuth)) {
          try {
            await Dialog.confirm({
              title: "提示",
              message: "您还未登录，需要登陆吗？",
            });
            localStorage.setItem("route", JSON.stringify(from));
            // 点击了确认就跳转到登陆页面
            next({ name: "login" });
          } catch (e) {
            // 点击了取消
            next(false);
          }
        } else {
          next();
        }
      } else {
        if (less.includes(to.name as string)) {
          next(false);
        } else {
          next();
        }
      }
    } else {
      if (less.includes(to.name as string)) {
        next(false);
      } else {
        next();
      }
    }
  }
});
export default router;
