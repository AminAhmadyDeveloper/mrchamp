export const waitForPage = (callback: () => void, debounce?: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(callback());
    }, debounce ?? 1000);
  });
};
