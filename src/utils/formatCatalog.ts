const CATALOG_TYPE: any = {
  share: "分享",
  ask: "提问",
  discuss: "讨论",
  advice: "建议",
};
export default (catalog: string) => {
  return CATALOG_TYPE[catalog];
};
