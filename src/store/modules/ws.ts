import { defineStore } from "pinia";
import WebSocketClient from "@/config/websocket";
interface wsState {
  ws: any;
  num: any;
}
export default defineStore("ws", {
  state(): wsState {
    return {
      ws: null,
      num: null,
    };
  },
  actions: {
    initWebSocket(config?: any) {
      this.ws = new WebSocketClient(config);
      this.ws.init();
    },
    onMessage(msg: any) {
      this.num = JSON.parse(msg.data);
    },
  },
});
