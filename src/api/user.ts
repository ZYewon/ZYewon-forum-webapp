import request from "@/service";

// 获取用户信息
export const getUserInfo = () => {
  return request.get({
    url: "/user/getUserInfo",
  });
};

// 签到
export const userSign = () => {
  return request.get({
    url: "/user/fav",
  });
};

// 修改用户基本信息
export const updateUser = (data: any) => {
  return request.post({
    url: "/user/basic",
    data,
  });
};

// 更新用户名
export const updateUserName = (data: any) => {
  return request.get({
    url: "/public/update-username",
    params: data,
  });
};

// 重置密码
export const updatePass = (data: any) => {
  console.log(data);
  return request.post({
    url: "/user/update-pass",
    data,
  });
};

// 获取我发表的帖子
export const getMyPost = (params: any) => {
  return request.get({
    url: "/user/mypost",
    params,
  });
};

// 收藏帖子
export const setCollect = (params: any) => {
  return request.get({
    url: "/user/set-collect",
    params,
  });
};

// 获取收藏列表
export const getCollectList = (params: any) => {
  return request.get({
    url: "/user/collect",
    params,
  });
};
// 获取收藏列表详细版
export const getCollectListDetail = (params: any) => {
  return request.get({
    url: "/user/collect-detail",
    params,
  });
};

// 删除我的文章
export const deletePostById = (params: any) => {
  return request.request({
    method: "DELETE",
    url: "/user/delete-post",
    params,
  });
};

// 获取用户最近评论
export const getCommentsList = (params: any) => {
  return request.get({
    url: "/user/last-comments",
    params,
  });
};

// 获取用户未读消息
export const getMsg = (params: any) => {
  return request.get({
    url: "/user/getmsg",
    params,
  });
};
// 删除消息（已读）
export const setMsg = (params: any) => {
  return request.get({
    url: "/user/setmsg",
    params,
  });
};

// 获取用户一周内的签到记录
export const getSingWeek = () => {
  return request.get({
    url: "/user/sign-week",
  });
};

export const getMyPageTotal = () => {
  return request.get({
    url: "/user/getpost-comments-hands-total",
  });
};
