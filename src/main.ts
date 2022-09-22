import { createApp } from "vue";
import router from "@/router";
import store from "@/store";

import { Icon, NavBar } from "vant";
import "vant/es/toast/style";
import "vant/lib/index.css";
import "normalize.css/normalize.css";

import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.use(router).use(store).use(Icon).use(NavBar).mount("#app");
