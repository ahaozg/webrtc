/* eslint-disable*/
// URl里面取得对应的key值
export function getUrlKey(name, url = window.location.href) {
  return decodeURIComponent((new RegExp(`[?|&]${name}=` + '([^&;]+?)(&|#|;|$)').exec(url) || [, ''])[1].replace(/\+/g, '%20')) || null;
}
/* eslint-enable*/
