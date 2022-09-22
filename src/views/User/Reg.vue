<template>
  <div class="wrapper">
    <van-nav-bar title="注册" left-arrow @click-left="$router.back" />
    <div class="form">
      <Form @submit="onSubmit">
        <cell-group inset>
          <field
            v-model.trim="regForm.username"
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
            v-model.trim="regForm.nickname"
            left-icon="friends"
            name="nickname"
            placeholder="请输入用户昵称"
            :rules="[{ required: true, message: '请填写用户昵称' }]"
          />
          <field
            v-model.trim="regForm.password"
            left-icon="bag"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <field
            v-model.trim="regForm.confirmPassword"
            left-icon="bag"
            type="password"
            name="confirmPassword"
            placeholder="请确认密码"
            :rules="[
              { required: true, message: '请再次输入密码' },
              {
                validator: confirmPasswordValidator,
                message: '两次密码输入不一致',
              },
            ]"
          />
          <field
            v-model.trim="regForm.code"
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
          <Button round block type="success" native-type="submit">注册</Button>
        </div>
        <div style="margin: 16px">
          <Button round block @click="$router.back">取消</Button>
          <!-- 注册和忘记密码 -->
          <Controls
            left-text="已有帐号"
            left-path-name="login"
            right-path-name="forget"
            right-text="忘记密码"
          />
          <FormBottom />
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useCaptcha } from "@/hooks/useCaptcha";
import Controls from "./Controls.vue";
import { Form, Field, CellGroup, Button, Toast } from "vant";
import FormBottom from "./FormBottom.vue";
import { regAsync } from "api/login";
const [svg, sid, resetCaptcha] = useCaptcha({ width: 150, height: 50 }); // 获取图形验证码的 hook
const regForm = reactive({
  username: "",
  nickname: "",
  password: "",
  confirmPassword: "",
  code: "",
});
const confirmPasswordValidator = (val: string) => val === regForm.password;
const router = useRouter();
const onSubmit = async (e: any) => {
  delete e.confirmPassword;
  const res = await regAsync({ sid: sid.value, ...e });
  if (res.code === 200) {
    Toast.success({
      message: "注册成功",
    });
    setTimeout(() => {
      router.replace({ name: "login" });
    }, 1500);
  } else {
    Toast.fail({
      message: res.msg,
    });
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .form {
    flex: 1;
    overflow: auto;
  }
}
</style>
