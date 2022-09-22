import { defineStore } from "pinia";
import { getCaptchaAsync } from "api/public";
import { v4 as uuidv4 } from "uuid";
interface globalState {
  sid: string;
  captcha: any;
}
interface captchaData {
  width?: number;
  height?: number;
}
export default defineStore("global", {
  state(): globalState {
    return {
      sid: "",
      captcha: null,
    };
  },
  actions: {
    // 获取验证码
    async getCode(data?: captchaData) {
      let sid = "";
      if (localStorage.getItem("sid")) {
        sid = localStorage.getItem("sid") as string;
      } else {
        sid = uuidv4();
        localStorage.setItem("sid", sid);
      }
      this.sid = sid;
      const res = await getCaptchaAsync({
        sid: this.sid,
        ...data,
      });
      this.captcha = res.data;
    },
  },
});
