import faces from "@/assets/js/face";
import { isEmpty } from "./index";
const htmlEncode = (html: string) => {
  let temp: any = document.createElement("div");
  temp.textContent !== undefined
    ? (temp.textContent = html)
    : (temp.innerText = html);
  const output = temp.innerHTML;
  temp = null;
  return output;
};

// 解析文本编辑器的内容
const escapeHtml = (content: string) => {
  if (isEmpty(content)) return;
  let result = content;
  const face = /\s?face\[\W{1,}\]/g;

  if (face.test(result)) {
    const group: any = result.match(face);
    group.map((item: any) => {
      const key = item.match(/\[\S+\]/g)[0];
      result = result.replace(item, `<img src="${faces[key]}"/>`);
    });
  }
  const img = /\s?img\[\S+\]/g;
  if (img.test(result)) {
    const group: any = result.match(img);
    group.map((item: any) => {
      const key = item.match(/\[(\S+)\]/)[1];
      result = result.replace(item, `<img src="${key}">`);
    });
  }
  // 链接替换 a(链接)[标题]
  const link = /\s?a\(\S+\)\[\S+\]/g;
  if (link.test(result)) {
    const group: any = result.match(link);
    group.map((item: any) => {
      const aLink = item.match(/\s?\((\S+)\)/)[1];
      const title = item.match(/\[(\S+)\]/)[1];
      result = result.replace(item, `<a href="${aLink}">${title}</a>`);
    });
  }
  // 引用替换
  result = result.replace(/\[quote\]/g, '<div class="layui-elem-quote">');
  result = result.replace(/\[\/quote\]/g, "</div>");
  // 代码块替换
  // 注意 html 标签不应该被 HTML 解析,应转换成 textContent
  // const code = /(\[\/?pre(.+?)[^\]]*\])/g;
  const code = /\[pre[\w\W]*?\[\/pre\]/g;
  if (code.test(result)) {
    const group: any = result.match(code);
    group.map((item: any) => {
      result = result.replace(item, htmlEncode(item));
    });
    result = result.replace(/\[pre\]/g, "<pre>");
    result = result.replace(/\[\/pre\]/g, "</pre>");
  }

  // hr 替换
  result = result.replace(/\[hr\]/g, "<hr/>");
  // 回车换行的替换
  result = result.replace(/\r\n/g, "<br>");
  result = result.replace(/\n/g, "<br>");
  return result;
};

export default escapeHtml;
