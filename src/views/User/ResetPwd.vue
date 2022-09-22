<template>
  <Layout :show-footer="false">
    <van-nav-bar
      title="修改密码"
      left-arrow
      @click-left="$router.back"
    ></van-nav-bar>
    <Form @submit="onSubmit">
      <cell-group inset>
        <Field
          v-model="resetForm.oldPassword"
          type="password"
          name="oldPassword"
          label="旧密码"
          placeholder="请输入旧密码"
          :rules="[{ required: true, message: '请填写旧密码' }]"
        />
        <Field
          v-model="resetForm.newPassword"
          type="password"
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <Field
          v-model="resetForm.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请再次输入密码' },
            { validator, message: '两次密码输入不一致', trigger: 'onChange' },
          ]"
        />
        <Field
          v-model="resetForm.code"
          label="验证码"
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
        />
        <div class="captcha" v-html="svg" @click="resetCaptcha"></div>
      </cell-group>
      <div style="margin: 16px">
        <Button block type="success" native-type="submit"> 提交 </Button>
      </div>
      <div style="margin: 16px">
        <Button block @click="$router.back"> 取消</Button>
      </div>
    </Form>
  </Layout>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Layout from "comp/Layout/index.vue";
import { Form, Field, CellGroup, Button, Toast } from "vant";
import { updatePass } from "api/user";
import { useCaptcha } from "@/hooks/useCaptcha";
const [svg, sid, resetCaptcha] = useCaptcha({ width: 150, height: 50 }); // 获取图形验证码的 hook
const resetForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
  code: "",
});
const validator = (val: string) => {
  return resetForm.newPassword === val;
};
const onSubmit = async (e: any) => {
  if (e.password === e.oldPassword) {
    return Toast({
      message: "请确保您的新密码和旧密码不一样",
    });
  }
  const res = await updatePass({
    oldPassword: e.oldPassword,
    password: e.password,
    code: e.code,
    sid: sid.value,
  });
  if (res.code === 200) {
    Toast.success({
      message: res.msg,
    });
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
</style>
