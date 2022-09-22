import request from "@/service";
interface captchaParams {
  sid: string;
  width?: number;
  height?: number;
}
// 获取验证码
export const getCaptchaAsync = (params: captchaParams) => {
  return request.get({
    url: "/public/getCaptcha",
    params,
  });
};
// 获取重置密码页面是否时间已过
export const getLinkTime = (key: string) => {
  return request.get({
    url: "/public/getLinkTime",
    params: {
      key,
    },
  });
};

// 获取签到列表
export const getSignList = (sort: any) => {
  return request.get({
    url: "/public/getSignList",
    params: {
      sort,
    },
  });
};

// 更新帖子阅读数据
export const setReads = (params: any) => {
  return request.get({
    url: "/public/reads",
    params,
  });
};

// 获取其它用户信息，包括自己
export const getBasicInfo = (params: any) => {
  return request.get({
    url: "/public/user",
    params,
  });
};

// 获取其他用户的文章列表，包括自己
export const getPostList = (params: any) => {
  return request.get({
    url: "/public/lastet-post",
    params,
  });
};
// 获取其他用户的评论列表，包括自己
export const getCommentsList = (params: any) => {
  return request.get({
    url: "/public/lastet-comments",
    params,
  });
};

export const getTags = () => {
  return request.get({
    url: "/public/tags",
  });
};
