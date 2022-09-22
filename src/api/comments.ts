import request from "@/service";
import UserStore from "store/modules/user";
import { isEmpty } from "@/utils";
// 获取文章评论
// TODO: 如果传入TOKEN 会获取用户的点赞记录
export const getComments = (params: any) => {
  const userStore = UserStore();
  return request.get({
    url: "/public/comments",
    params,
    headers: isEmpty(userStore.token)
      ? {}
      : {
          authorization: "Bearer " + userStore.token,
        },
  });
};
// 发表评论 or 更新评论
export const addComment = (data: any) => {
  return request.post({
    url: "/comments/reply",
    data,
  });
};
// 采纳评论
export const setBestAsync = (params: any) => {
  return request.get({
    url: "/comments/accept",
    params,
  });
};

export const setHadns = (params: any) => {
  return request.get({
    url: "/comments/hands",
    params,
  });
};
