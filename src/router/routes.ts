import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("views/Home/Home.vue"),
    children: [
      {
        path: "",
        name: "home-catalog",
        props: true,
        component: () => import("views/Home/Catalog.vue"),
      },
      {
        path: "/index/:catalog",
        name: "catalog",
        props: true,
        component: () => import("views/Home/Catalog.vue"),
      },
    ],
  },
  {
    path: "/content/:tid",
    props: true,
    name: "content",
    component: () => import("views/Content/Content.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("views/User/Login.vue"),
  },
  {
    path: "/reg",
    name: "reg",
    component: () => import("views/User/Reg.vue"),
  },
  {
    path: "/forget",
    name: "forget",
    component: () => import("views/User/Forget.vue"),
  },
  {
    path: "/user",
    name: "user",

    component: () => import("views/User/User.vue"),
  },
  {
    path: "/hot/:type",
    props: true,
    name: "hot",
    component: () => import("views/Hot/Hot.vue"),
  },
  {
    path: "/msg/:type",
    props: true,
    name: "msg",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/Msg/Msg.vue"),
  },
  {
    path: "/mypost",
    name: "mypost",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/MyPost.vue"),
  },
  {
    path: "/mycollect",
    name: "mycollect",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/MyCollect.vue"),
  },
  {
    path: "/my",
    name: "my",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/My.vue"),
  },
  {
    path: "/setpasswd",
    name: "setpasswd",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/ResetPwd.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/Settings.vue"),
  },
  {
    path: "/sign",
    name: "sign",
    meta: {
      requireAuth: true,
    },
    component: () => import("views/User/Sign.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    component: () => import("views/NotFound/index.vue"),
  },
];

export default routes;
