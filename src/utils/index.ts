export const delay = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 2000);
  });
};
export const isEmpty = (data: any) =>
  typeof data === "undefined" || data === null || data === "";

// 将文件转换为 base64
export const changeBase64 = (data: any) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(data);
    fileReader.onload = (e) => {
      resolve(e.target?.result);
    };
    fileReader.onerror = () => {
      resolve(false);
    };
  });
};
