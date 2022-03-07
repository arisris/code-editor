export const canUseWindow = (property?: string) => {
  const isBrowser = !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
  if (property) return isBrowser && typeof window[property] !== "undefined";
  return isBrowser;
};

export const noopFn = () => {};
