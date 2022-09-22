import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn"); // 全局使用简体中文
dayjs.extend(relativeTime);
export default (date: any) => {
  if (dayjs(date).isBefore(dayjs().subtract(7, "day"))) {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  } else {
    return dayjs(date).from(dayjs());
  }
};
