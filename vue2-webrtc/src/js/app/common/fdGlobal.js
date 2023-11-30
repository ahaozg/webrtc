// 函数防抖
import debounce from '@/components/tools/extend/debounce.js';
// 函数节流
import throttle from '@/components/tools/extend/throttle.js';
// 获取兼容ie和非ie的event对象
import getEvent from '@/components/tools/extend/getEvent.js';
// 阻止默认事件
import stopEvent from '@/components/tools/extend/stopEvent.js';
// 绑定|取消事件函数
import event from '@/components/tools/extend/event.js';
// 执行时间记录工具
import fdPerformance from '@/components/tools/extend/performance.js';
// 日志工具
import fdLog from '@/components/tools/extend/log.js';
// console日志模块， 因为console为全局对象，所以用$console为变量名
import $console from '@/components/tools/extend/console.js';
// 判断浏览器的对象
import browser from '@/components/tools/extend/browser.js';
// 处理了的ajax
import ajax from '@/components/tools/extend/ajax.js';
// 未处理的axios
import axios from 'axios';
// 模拟树数据
import mockTreeData from '@/components/tools/extend/mockTreeData.js';

function FdGlobal() {
  this.author = 'haozg';
}

FdGlobal.prototype = {
  // 处理了的ajax
  ajax,
  // 未处理的axios
  axios,
  // 绑定|取消事件函数
  ...event,
  // 函数防抖
  debounce,
  // 函数节流
  throttle,
  // 获取兼容ie和非ie的event对象
  getEvent,
  // 阻止默认事件
  stopEvent,
  // 日志模块
  ...$console,

  /**
     * @type {object}
     * @description 记录消耗时间的对象，其以下有6个方法。详情请看{@link performance}对象文档
     * @see  {@link performance}
     * @property {Function} performance.start() 开启【时间消耗工具】
     * @property {Function} performance.stop() 终止【时间消耗工具】
     * @property {Function} performance.create()  创建记录【时间消耗的面板】
     * @property {Function} performance.setStartTime() 重新设置【时间消耗工具】的开始时间
     * @property {Function} performance.getCurrentTime() 获取当前时间，毫秒时间
     * @property {Function} performance.execute()  记录代码运行到这里，消耗的时间日志

     */
  performance: fdPerformance,

  /**
     * @type {object}
     * @description  记录流程性日志的对象，其以下有6个方法。详情请看{@link log}对象文档
     * @see {@link log}
     * @property {Function} log.start()  开启【日志记录工具】
     * @property {Function} log.stop() 终止【日志记录工具】
     * @property {Function} log.create()  创建记录【日志的面板】
     * @property {Function} log.setRecodeLog()  重新设置【日志记录工具】的记录状态
     * @property {Function} log.execute()  生成日志的方法
     */
  log: fdLog,

  /**
     * @type {object}
     * @description  判断浏览器的对象，其以下有11个方法。详情请看{@link browser}对象文档
     * @see {@link browser}
     * @property {Function} browser.getVersion()  获取当前浏览器的版本号
     * @property {Function} browser.isChrome() 检测当前浏览器是否为chrome
     * @property {Function} browser.isCompatible()  检测当前浏览器是否能够与UEditor良好兼容
     * @property {Function} browser.isGecko()  检测当前浏览器内核是否是gecko内核
     * @property {Function} browser.isIe()  检测当前浏览器是否为IE
     * @property {Function} browser.isIeCompat()  检测浏览器模式是否为 IE 兼容模式
     * @property {Function} browser.isMac()  检测当前浏览器是否是运行在mac平台下
     * @property {Function} browser.isOpera()  检测当前浏览器是否为Opera
     * @property {Function} browser.isQuirks()  检测当前浏览器是否处于quirks(“怪异模式”)下
     * @property {Function} browser.isSafari()  检测当前浏览器是否为Safari
     * @property {Function} browser.isWebkit()  检测当前浏览器是否是webkit内核的浏览器
     */
  browser: browser,
  // 模拟树数据
  mockTreeData,

  clone(targetObj, gClone, ignoreKeys) {
    if (targetObj === null) {
      return null;
    }
    const copyObject = Object.prototype.toString.apply(targetObj) === '[object Array]' ? [] : {};
    for (const i in targetObj) {
      if (ignoreKeys.indexOf(i) === -1) {
        copyObject[i] = typeof targetObj[i] === 'object' ? gClone(targetObj[i], gClone, ignoreKeys) : targetObj[i];
      }
    }
    return copyObject;
  },
  // 深度复制的的方法
  deepClone: function (obj) {
    const result = Array.isArray(obj) ? [] : {};
    for (const _key in obj) {
      const _copy = obj[_key];
      // 对象，继续递归
      if (Object.prototype.toString.call(_copy) === '[object Object]') {
        result[_key] = window.fdGlobal.deepClone(_copy);
        // 数组，继续递归
      } else if (Array.isArray(_copy)) {
        result[_key] = window.fdGlobal.deepClone(_copy);
      } else {
        // 其他直接赋值
        result[_key] = obj[_key];
      }
    }
    return result;
  },
};
window.fdGlobal = new FdGlobal();
export default FdGlobal;
