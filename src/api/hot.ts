import request from "@/service";
// 获取热门帖子
const getHotPost = (params: any) => {
  return request.get({
    url: "/public/hotPost",
    params,
  });
};
// 获取热门评论
const getHotComments = (params: any) => {
  return request.get({
    url: "/public/hotComments",
    params,
  });
};
// 签到排行
const getHotSignRecord = (params: any) => {
  return request.get({
    url: "/public/hotSignRecord",
    params,
  });
};

export { getHotPost, getHotComments, getHotSignRecord };
