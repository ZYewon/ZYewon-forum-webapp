import { computed, ComputedRef } from "vue";
import GlobalStore from "store/modules/global";
interface captchaData {
  width?: number;
  height?: number;
}
export const useCaptcha = (
  data?: captchaData
): [ComputedRef<any>, ComputedRef<any>, (e: any) => void] => {
  const globalStore = GlobalStore();
  globalStore.getCode(data);
  const svg = computed(() => globalStore.captcha);
  const sid = computed(() => globalStore.sid);
  const resetCaptcha: (e: any) => void = (e) => {
    globalStore.getCode(data);
  };
  return [svg, sid, resetCaptcha];
};
