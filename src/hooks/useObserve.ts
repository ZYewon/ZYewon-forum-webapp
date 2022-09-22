export const useObserve = (
  el: HTMLElement,
  func: (item: IntersectionObserverEntry) => void
) => {
  const ob = new IntersectionObserver((e) => {
    const item = e[0];
    if (item.isIntersecting) {
      func(item);
    }
  });
  ob.observe(el);
  return () => {
    ob.unobserve(el);
  };
};
