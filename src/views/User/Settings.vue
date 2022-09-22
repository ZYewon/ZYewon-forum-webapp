<template>
  <Layout :show-footer="false">
    <van-nav-bar
      title="修改设置"
      left-arrow
      @click-left="$router.back"
    ></van-nav-bar>
    <Form @submit="onSubmit">
      <Field name="pic" v-model="setForm.pic">
        <template #input>
          <div class="flex center">
            <div class="upload-img" @click="uploadClick">
              <img
                :src="setForm.pic ? setForm.pic : `/img/bear-200-200.jpg`"
                alt=""
              />
              <van-icon name="photograph" color="#ccc" size="5vw" />
              <input
                ref="uploadInput"
                type="file"
                style="display: none"
                accept=".jpg,.png,.jpeg"
                @change="uploadChange"
              />
            </div>
          </div>
        </template>
      </Field>

      <cell-group inset>
        <Field
          v-model="setForm.username"
          type="text"
          name="username"
          label="账号"
          placeholder="请输入账号"
        />
        <Field
          v-model="setForm.nickname"
          type="text"
          name="nickname"
          label="昵称"
          placeholder="请填写昵称"
        />
        <Field
          v-model="setForm.location"
          type="text"
          name="location"
          label="城市"
          placeholder="请输入城市"
        />
        <Field
          v-model="setForm.gender"
          name="gender"
          label="性别"
          is-link
          @click="showPicker = true"
        />
        <Popup v-model:show="showPicker" position="bottom">
          <Picker
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </Popup>
        <Field
          v-model="setForm.remark"
          name="remark"
          rows="2"
          autosize
          label="个性签名"
          type="textarea"
          placeholder="介绍一下自己吧"
        />
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
import { reactive, ref, computed, onMounted } from "vue";
import Layout from "comp/Layout/index.vue";
import { Form, Field, CellGroup, Button, Popup, Picker, Toast } from "vant";
import UserStore from "store/modules/user";
import { baseURL } from "@/config";
import { changeBase64 } from "@/utils";
import { updateUser, updateUserName } from "api/user";
import { uploadImg } from "api/content";
const setForm = reactive({
  pic: "",
  username: "",
  nickname: "",
  location: "",
  gender: "",
  remark: "",
});
const showPicker = ref(false);
const columns = ["男", "女"];
const userStore = UserStore();
const uploadInput = ref<HTMLInputElement>();
const userinfo = computed(() => userStore.userinfo);
const setFormData = () => {
  setForm.username = userinfo.value.username;
  setForm.nickname = userinfo.value.nickname;
  setForm.pic = userinfo.value.pic;
  setForm.gender = +userinfo.value.gender === 0 ? "男" : "女";
  setForm.location = userinfo.value.location;
  setForm.remark = userinfo.value.remark;
};
onMounted(() => {
  setFormData();
});
// 文件选择的输入框变化事件
const uploadChange = async (e: any) => {
  const file = e.target.files[0];
  const fm = new FormData();
  fm.append("file", file);
  const imgSrc = await uploadImg(fm);
  if (imgSrc.code === 200) {
    setForm.pic = baseURL + "/" + imgSrc.imgUrl;
  } else {
    Toast.fail({
      message: "图片预览失败",
    });
  }
};
const uploadClick = () => {
  uploadInput.value?.click();
};
const onConfirm = (e: any) => {
  setForm.gender = e;
  showPicker.value = false;
};
const onSubmit = async (e: any) => {
  const data = {
    ...e,
  };
  if (e.gender) data.gender = e.gender === "男" ? "0" : "1";
  const res = await updateUser(data);
  if (res.code === 200) {
    Toast.success({
      message: res.msg,
    });
    await userStore.initLoginState();
  }
};
</script>

<style scoped lang="scss">
:deep(.van-field__control--custom) {
  justify-content: center;
}

.flex {
  display: flex;
  &.center {
    justify-content: center;
  }
  margin-top: 20px;
}
.upload-img {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  i {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 12;
  }
  img {
    width: 100%;
  }
}
</style>
