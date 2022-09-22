import { defineStore } from "pinia";
import {
  deletePostById,
  getMyPost,
  getUserInfo,
  getCollectListDetail,
  setCollect,
} from "api/user";
import { loginAsync } from "api/login";
import Ws from "./ws";
import { Dialog, Toast } from "vant";
interface ILogin {
  username: string;
  password: string;
  code: string;
  sid: string;
}
interface userState {
  userinfo: any;
  isLogin: boolean;
  token: string;
  postList: any[];
  postIsEnd: boolean;
  total: number;
  collectTotal: number;
  collectList: any[];
  collectIsEnd: boolean;
}
export default defineStore("user", {
  state(): userState {
    return {
      userinfo: {},
      isLogin: false,
      token: "",
      postList: [],
      total: 0,
      postIsEnd: false,
      collectList: [],
      collectTotal: 0,
      collectIsEnd: false,
    };
  },
  actions: {
    // 初始化用户状态，如果在以登陆的状态下刷新，则继续保持登陆状态，除非 token 过期
    async initLoginState() {
      const res = await getUserInfo();
      if (res.code === 200) {
        const ws = Ws();
        ws.initWebSocket();
        this.userinfo = res.data;
        this.isLogin = true;
      } else {
        this.userinfo = {};
        this.token = "";
        this.isLogin = false;
      }
    },
    // 登录
    async login(data: ILogin) {
      const res = await loginAsync(data);
      if (res.code === 200 && res.data.token) {
        this.userinfo = res.data.data;
        this.token = res.data.token;
        this.isLogin = true;
        return {
          status: true,
          msg: res.msg,
        };
      } else {
        return {
          status: false,
          msg: res.msg,
        };
      }
    },
    // 退出登录
    async logout() {
      const ws = Ws();
      this.token = "";
      this.userinfo = "";
      this.isLogin = false;
      ws.num = null;
    },
    // 获取我的帖子
    async getPostList(params?: any) {
      const res = await getMyPost(params);
      if (res.code === 200) {
        if (this.postList.length === 0) {
          this.postList = res.data;
        } else {
          this.postList.push(...res.data);
        }
        this.total = res.total;
        if (this.postList.length >= res.total) {
          this.postIsEnd = true;
        }
      } else {
        Toast.fail({
          message: res.msg,
        });
      }
    },
    // 删除我的帖子
    async deletePost(tid: string) {
      Dialog.confirm({
        title: "提示",
        message: "确定要删除该文章吗？",
      })
        .then(async () => {
          const res = await deletePostById({
            tid,
          });
          if (res.code === 200) {
            Toast.success({
              message: res.msg,
            });
            this.postList = [];
            await this.getPostList();
          } else {
            Toast.fail({
              message: res.msg,
            });
          }
        })
        .catch(() => {
          Toast({
            message: "取消了操作",
          });
        });
    },
    // 获取我的收藏列表
    async getCollectList(params?: any) {
      const res = await getCollectListDetail(params);
      if (res.code === 200) {
        if (this.collectList.length === 0) {
          this.collectList = res.data;
        } else {
          this.collectList.push(...res.data);
        }
        this.collectTotal = res.total;
        if (this.collectList.length >= res.total) {
          this.collectIsEnd = true;
        }
      } else {
        Toast.fail({
          message: res.msg,
        });
      }
    },
    // 取消收藏
    async cancelCollect(id: string) {
      try {
        await Dialog.confirm({
          title: "提示",
          message: "确定要删除该文章吗？",
        });
        const res = await setCollect({ tid: id, isCollect: 0 });
        if (res.code === 200) {
          const index = this.collectList.findIndex((item) => item._id === id);
          this.collectList.splice(index, 1);

          Toast.success({
            message: "取消收藏成功",
          });
        }
      } catch (e) {
        Toast({
          message: "取消了操作",
        });
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["token"],
      },
    ],
  },
});
