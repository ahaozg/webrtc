/*eslint-disable*/
import {NAME, StorageKeys} from '../constants/constant';

/**
 * 获取向下取整的 performance.now() 值
 * @export
 * @return {Number}
 */
// eslint-disable-next-line require-jsdoc
export function performanceNow() {
  return Math.floor(performance.now());
}

export const isFunction = (param) => typeof param === 'function';
export const isUndefined = (param) => typeof param === 'undefined';
export const isString = (param) => typeof param === 'string';
export const isNumber = (param) => typeof param === 'number';
export const isBoolean = (param) => typeof param === 'boolean';

export function userIdMain(userId) {
  return `${userId}-${NAME.MAIN}`;
}
export function userIdAuxiliary(userId) {
  return `${userId}-${NAME.AUXILIARY}`;
}

/**
 *  mixins class
 */
export function MixinsClass(...mixins) {
  class MixClass {
    constructor() {
      // eslint-disable-next-line no-restricted-syntax
      for (const Mixin of mixins) {
        copyProperties(this, new Mixin(this)); // 拷贝实例属性 同时执行内部初始化
      }
    }
  }
  const proto = MixClass.prototype;
  // eslint-disable-next-line no-restricted-syntax
  for (const mixin of mixins) {
    copyProperties(MixClass, mixin); // 拷贝静态属性
    copyProperties(proto, mixin.prototype); // 拷贝原型属性
  }
  return MixClass;
}

/**
 *
 * @param target
 * @param source
 */
function copyProperties(target, source) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      const desc = Object.getOwnPropertyDescriptor(source, key) || '';
      Object.defineProperty(target, key, desc);
    }
  }
}

/**
 * userId 和屏幕分享 shareUserId 是否相互包含
 * shareUserId 要求格式：`share_${userId}`，否则无法解析出来
 * @param {String} userId 用户 userId
 * @param {String} shareUserId 用户屏幕分享的 userId
 * @return {Boolean} 是否
 */
export function isContained(userId, shareUserId) {
  return shareUserId === `share_${userId}`;
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {Number} delay 间隔时间, 毫秒
 * @param {any} args 其他参数
 * @returns {function} 回调函数
 */
export function debounce(fn, delay, ...args) {
  let timer;
  return function (...e) {
    if (timer > 0) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      // eslint-disable-next-line no-invalid-this
      fn.apply(this, [...args, ...e]);
      timer = -1;
    }, delay);
  };
}

/**
 * 节流函数
 * @param {function} func 函数
 * @param {number} wait 时间
 * @return {function} 函数
 */
export function throttle(func, wait) {
  let canRun = true;
  return function () {
    if (!canRun) {
      return;
    }
    canRun = false;
    setTimeout(() => {
      func.apply(this, arguments);
      canRun = true;
    }, wait);
  };
}

export function getVoiceVolume() {
  const defaultVoiceVolume = 50;
  return window.localStorage.getItem(StorageKeys.voiceVolume) ? Number(window.localStorage.getItem(StorageKeys.voiceVolume)) : defaultVoiceVolume;
}

export function getMicrophoneVolume() {
  const defaultMicrophoneVolume = 100;
  return window.localStorage.getItem(StorageKeys.microphoneVolume) ? Number(window.localStorage.getItem(StorageKeys.microphoneVolume)) : defaultMicrophoneVolume;
}

export function isKorean(text) {
  const reg = /([(\uAC00-\uD7AF)|(\u3130-\u318F)])+/gi;
  return reg.test(text);
}

/**
 * @function
 * @description  获取随机数
 * @returns {String} 随机数
 */
function getRandomForUUID() {
  // eslint-disable-next-line no-magic-numbers
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * @function
 * @description  生成32位uuId
 * @returns {Object} 返回值
 */
export function getUUID() {
  return (getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID() +
      getRandomForUUID());
}

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * 对象深拷贝
 * @param {object} obj 对象
 * @param {array}cache 缓存
 * @return {*[]|*} 返回拷贝
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, c => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  });

  Object.keys(obj).forEach(key => {
    if (key === '__vue__') {
      copy[key] = '__vue__';
    } else {
      copy[key] = deepCopy(obj[key], cache);
    }
  });

  return copy;
}

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry|BB10/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
    );
  },
  getOsName: function () {
    let osName = 'Unknown OS';
    if (isMobile.Android()) {
      osName = 'Android';
    }
    if (isMobile.BlackBerry()) {
      osName = 'BlackBerry';
    }
    if (isMobile.iOS()) {
      osName = 'iOS';
    }
    if (isMobile.Opera()) {
      osName = 'Opera Mini';
    }
    if (isMobile.Windows()) {
      osName = 'Windows';
    }
    return {
      osName,
      type: 'mobile'
    };
  }
};

export function detectDesktopOS() {
  const unknown = '-';
  const nVer = navigator.appVersion;
  const nAgt = navigator.userAgent;
  let os = unknown;
  const clientStrings = [
    {
      s: 'Chrome OS',
      r: /CrOS/
    },
    {
      s: 'Windows 10',
      r: /(Windows 10.0|Windows NT 10.0)/
    },
    {
      s: 'Windows 8.1',
      r: /(Windows 8.1|Windows NT 6.3)/
    },
    {
      s: 'Windows 8',
      r: /(Windows 8|Windows NT 6.2)/
    },
    {
      s: 'Windows 7',
      r: /(Windows 7|Windows NT 6.1)/
    },
    {
      s: 'Windows Vista',
      r: /Windows NT 6.0/
    },
    {
      s: 'Windows Server 2003',
      r: /Windows NT 5.2/
    },
    {
      s: 'Windows XP',
      r: /(Windows NT 5.1|Windows XP)/
    },
    {
      s: 'Windows 2000',
      r: /(Windows NT 5.0|Windows 2000)/
    },
    {
      s: 'Windows ME',
      r: /(Win 9x 4.90|Windows ME)/
    },
    {
      s: 'Windows 98',
      r: /(Windows 98|Win98)/
    },
    {
      s: 'Windows 95',
      r: /(Windows 95|Win95|Windows_95)/
    },
    {
      s: 'Windows NT 4.0',
      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    },
    {
      s: 'Windows CE',
      r: /Windows CE/
    },
    {
      s: 'Windows 3.11',
      r: /Win16/
    },
    {
      s: 'Android',
      r: /Android/
    },
    {
      s: 'Open BSD',
      r: /OpenBSD/
    },
    {
      s: 'Sun OS',
      r: /SunOS/
    },
    {
      s: 'Linux',
      r: /(Linux|X11)/
    },
    {
      s: 'iOS',
      r: /(iPhone|iPad|iPod)/
    },
    {
      s: 'Mac OS X',
      r: /Mac OS X/
    },
    {
      s: 'Mac OS',
      r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    },
    {
      s: 'QNX',
      r: /QNX/
    },
    {
      s: 'UNIX',
      r: /UNIX/
    },
    {
      s: 'BeOS',
      r: /BeOS/
    },
    {
      s: 'OS/2',
      r: /OS\/2/
    },
    {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }
  ];
  for (var i = 0, cs; (cs = clientStrings[i]); i++) {
    if (cs.r.test(nAgt)) {
      os = cs.s;
      break;
    }
  }
  let osVersion = unknown;
  if (/Windows/.test(os)) {
    if (/Windows (.*)/.test(os)) {
      osVersion = (/Windows (.*)/).exec(os)[1];
    }
    os = 'Windows';
  }
  switch (os) {
    case 'Mac OS X':
      if (/Mac OS X (10[/._\d]+)/.test(nAgt)) {
        // eslint-disable-next-line no-useless-escape
        osVersion = (/Mac OS X (10[\.\_\d]+)/).exec(nAgt)[1];
      }
      break;
    case 'Android':
      // eslint-disable-next-line no-useless-escape
      if (/Android ([\.\_\d]+)/.test(nAgt)) {
        // eslint-disable-next-line no-useless-escape
        osVersion = (/Android ([\.\_\d]+)/).exec(nAgt)[1];
      }
      break;
    case 'iOS':
      if (/OS (\d+)_(\d+)_?(\d+)?/.test(nAgt)) {
        osVersion = (/OS (\d+)_(\d+)_?(\d+)?/).exec(nVer);
        osVersion = `${osVersion[1]}.${osVersion[2]}.${osVersion[3] | 0}`;
      }
      break;
  }
  return {
    osName: os + osVersion,
    type: 'desktop'
  };
}

export function getOS() {
  if (isMobile.any()) {
    return isMobile.getOsName();
  }
  return detectDesktopOS();
}

export function getSystemOS() {
  const userAgent = navigator.userAgent;
  const osMatch = userAgent.match(/(Win|Mac|Linux)/);
  const os = (osMatch && osMatch[1]) || '';
  let arch = userAgent.match(/x86_64|Win64|WOW64/) || navigator.cpuClass === 'x64'
      ? 'x64'
      : 'x86';
  return {
    os,
    arch: os === 'Win' ? arch : ''
  }
}

export function getBrowser() {
  const sys = {};
  const ua = navigator.userAgent.toLowerCase();
  let s;
  (s = ua.match(/qqbrowser\/([\d.]+)/))
      ? (sys.qq = s[1])
      : (s = ua.match(/se 2.x\/([\d.]+)/))
      ? (sys.sougao = s[1])
      : (s = ua.match(/edge\/([\d.]+)/))
          ? (sys.explorer2345 = s[1])
          : (s = ua.match(/2345explorer\/([\d.]+)/))
              ? (sys.edge = s[1])
              : (s = ua.match(/rv:([\d.]+)\) like gecko/))
                  ? (sys.ie = s[1])
                  : (s = ua.match(/msie ([\d.]+)/))
                      ? (sys.ie = s[1])
                      : (s = ua.match(/firefox\/([\d.]+)/))
                          ? (sys.firefox = s[1])
                          : (s = ua.match(/tbs\/([\d]+)/))
                              ? (sys.tbs = s[1])
                              : (s = ua.match(/xweb\/([\d]+)/))
                                  ? (sys.xweb = s[1])
                                  : (s = ua.match(/chrome\/([\d.]+)/))
                                      ? (sys.chrome = s[1])
                                      : (s = ua.match(/opera.([\d.]+)/))
                                          ? (sys.opera = s[1])
                                          : (s = ua.match(/version\/([\d.]+).*safari/))
                                              ? (sys.safari = s[1])
                                              : 0;

  if (sys.qq) {
    return {browser: 'QQ浏览器', version: sys.qq};
  }
  if (sys.sougao) {
    return {browser: '搜狗浏览器', version: sys.sougao};
  }
  if (sys.explorer2345) {
    return {browser: '2345浏览器', version: sys.explorer2345};
  }
  if (sys.xweb) {
    return {browser: 'webView XWEB', version: ''};
  }
  if (sys.tbs) {
    return {browser: 'webView TBS', version: ''};
  }
  if (sys.edge) {
    return {browser: 'Edge', version: sys.edge};
  }
  if (sys.ie) {
    return {browser: 'IE', version: sys.ie};
  }
  if (sys.firefox) {
    return {browser: 'Firefox', version: sys.firefox};
  }
  if (sys.chrome) {
    return {browser: 'Chrome', version: sys.chrome};
  }
  if (sys.opera) {
    return {browser: 'Opera', version: sys.opera};
  }
  if (sys.safari) {
    return {browser: 'Safari', version: sys.safari};
  }

  return {browser: '', version: '0'};
}

// 校验定位
export function validatePosition(wrap = document.body || document.documentElement, errorClass = '.is-error', offsetTop = 60) {
  // 进行高度判断，让校验从上到下定位
  const doms = document.querySelectorAll(errorClass);
  let top = -1;
  if (doms.length) {
    top = wrap.scrollTop - (wrap.getBoundingClientRect().top - doms[0].getBoundingClientRect().top + offsetTop);
  }
  // 定位
  document.body.scrollTop = top;
  document.documentElement.scrollTop = top;
  return top;
}

export function standardizationError(error) {
  if (error?.getCode && error?.getCode()) {
    error.code = error.getCode();
  }
}
