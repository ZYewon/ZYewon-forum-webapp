import request from "@/service";

// 忘记密码
export const forgetAsync = (data: any) => {
  return request.post({
    url: "/login/forget",
    data,
  });
};
// 登录
export const loginAsync = (data: any) => {
  return request.post({
    url: "/login/login",
    data,
  });
};
// 注册
export const regAsync = (data: any) => {
  return request.post({
    url: "/login/reg",
    data,
  });
};

// 重置密码
export const resetAsync = (data: any) => {
  return request.post({
    url: "/login/reset-pass",
    data,
  });
};
