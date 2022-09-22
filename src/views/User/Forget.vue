<template>
  <div>
    <van-nav-bar title="找回密码" left-arrow @click-left="$router.back" />
    <Form @submit="onSubmit">
      <cell-group inset>
        <field
          v-model.trim="forgetForm.username"
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
          v-model.trim="forgetForm.code"
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
        <Button block type="success" native-type="submit">确定发送</Button>
      </div>
      <div style="margin: 16px">
        <Button block>取消</Button>
        <Controls
          left-text="已有帐号"
          left-path-name="login"
          right-path-name="reg"
          right-text="注册"
        />
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Form, Field, CellGroup, Button, Toast } from "vant";

import { useCaptcha } from "@/hooks/useCaptcha";
const [svg, sid, resetCaptcha] = useCaptcha({ width: 150, height: 50 }); // 获取图形验证码的 hook
const forgetForm = reactive({
  username: "",
  code: "",
});
const onSubmit = () => {};
</script>

<style scoped></style>
