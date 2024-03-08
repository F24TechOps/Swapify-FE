export function normalizeUrl(url) {
  let urlObj = new URL(url);
  return urlObj.pathname;
}
