import request from "@/service";
import { isEmpty } from "@/utils";
import UserStore from "store/modules/user";
import user from "store/modules/user";
// 获取文章列表
export const getListAsync = (options: any) => {
  return request.get({
    url: `/public/list`,
    params: options,
  });
};
// 温馨提醒
export const getTipsAsync = () => {
  return request.get({
    url: "/public/tips",
  });
};
// 友情链接
export const getLinksAsync = () => {
  return request.get({
    url: "/public/links",
  });
};
// 本周热议
export const getTopAsync = () => {
  return request.get({
    url: "/public/topWeek",
  });
};

// 上传图片
export const uploadImg = (data: any) => {
  return request.post({
    url: "/content/upload",
    data,
  });
};

// 发表帖子
export const addPost = (data: any) => {
  return request.post({
    url: "/content/add",
    data,
  });
};

// 获取文章详情
export const getDetail = (tid: string) => {
  const userStore = UserStore();
  return request.get({
    url: "/public/content/detail",
    params: {
      tid,
    },
    headers: isEmpty(userStore.token)
      ? {}
      : {
          authorization: "Bearer " + userStore.token,
        },
  });
};

// 编辑文章
export const editPost = (data: any) => {
  return request.post({
    url: "/content/edit",
    data,
  });
};
