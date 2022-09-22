<template>
  <div>
    <van-nav-bar title="登录" left-arrow @click-left="router.back" />
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="" />
    </div>
    <Form @submit="onSubmit">
      <cell-group inset>
        <field
          v-model="loginForm.username"
          left-icon="manager"
          name="username"
          placeholder="请输入用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            {
              pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
              message: '请输入合法的用户名（邮箱格式）',
              trigger: 'onChange',
            },
          ]"
        />
        <field
          v-model="loginForm.password"
          left-icon="bag"
          type="password"
          name="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <field
          v-model="loginForm.code"
          left-icon="photo"
          type="text"
          name="code"
          placeholder="请输入验证码"
          style="position: relative"
          :rules="[
            { required: true, message: '请填写验证码' },
            {
              pattern: /.{4}/,
              message: '请输入正确长度的验证码',
              trigger: 'onChange',
            },
          ]"
        >
        </field>
        <div class="captcha" v-html="svg" @click="resetCaptcha"></div>
      </cell-group>
      <div style="margin: 16px">
        <Button round block type="success" native-type="submit">提交</Button>

        <!-- 注册和忘记密码 -->
        <Controls
          left-path-name="reg"
          left-text="注册"
          right-path-name="forget"
          right-text="忘记密码"
        />
        <FormBottom />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, CellGroup, Button, Toast } from "vant";
import { useCaptcha } from "@/hooks/useCaptcha";
import Controls from "./Controls.vue";
import FormBottom from "./FormBottom.vue";
import UserStore from "store/modules/user";
import Ws from "store/modules/ws";
const [svg, sid, resetCaptcha] = useCaptcha({ width: 150, height: 50 }); // 获取图形验证码的 hook
const userStore = UserStore();
const router = useRouter();
const loginForm = reactive({
  username: "",
  password: "",
  code: "",
});
const onSubmit = async (e: any) => {
  const res = await userStore.login({ sid: sid.value, ...e });
  if (res.status) {
    const route: any = JSON.parse(localStorage.getItem("route") || "");
    const ws = Ws();
    ws.initWebSocket(); // 初始化 webSocket
    if (!route) {
      router.replace({ name: "home-catalog" });
    } else {
      localStorage.removeItem("route");
      router.replace({ name: route.name });
    }
  } else {
    Toast.fail({
      message: res.msg,
    });
  }
};
</script>

<style scoped lang="scss">
.captcha {
  display: inline-block;
}
.logo {
  padding-top: 100px;
  padding-bottom: 100px;
  text-align: center;
  img {
    width: 40%;
  }
}
.form-controls {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 40px;
  box-sizing: border-box;
  padding: 0 20px;
  a {
    color: #333;
    font-size: 30px;
    &:active {
      color: #4fc08d;
    }
  }
}
.form-bottom {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}
</style>
