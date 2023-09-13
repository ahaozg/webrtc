/**
 *@file throttle
 *@version 1.0.0
 *@author haozg
 *@createTime 2021/01/22
 *@updateTime 2021/01/22
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description throttle 节流 主要用于按钮的节流
 */
import getUUID from './getUUID';

const defaultTime = 300;

/**
 *  节流 每单位时间可触发一次
 *  第一次瞬间触发，最后一次不管是否达到间隔时间依然触发
 * 【考虑到input的change事件】
 *  @param {?Number|defaultTime} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|'click'} event - 事件类型 例：'click'
 *  @param {Array} binding.value - [fn,event,time]
 *  @example
 *  例：<button v-throttle="[reset,`click`,300]">刷新</button>
 *  也可简写成：<button v-throttle="[reset]">刷新</button>
 *  传递参数则：<button v-throttle="[()=>reset(param),`click`,300]">刷新</button>
 */
const throttle = {
  inserted: function (el, binding) {
    const [fn, event = 'click', time = defaultTime] = binding.value;
    let timer = null;
    // eslint-disable-next-line camelcase
    let timer_end = null;
    el._throttleID = `throttle${getUUID()}`;
    el.addEventListener(event, el[el._throttleID] = () => {
      if (timer) {
        clearTimeout(timer_end);
        // eslint-disable-next-line camelcase
        timer_end = setTimeout(() => fn(), time);
        return false;
      }
      fn();
      // eslint-disable-next-line
      timer = setTimeout(() => timer = null, time);
    });
  },
  unbind(el, binding) {
    const [event = 'click'] = binding.value;
    el.removeEventListener(event, el[el._throttleID]);
    el[el._throttleID] = null;
    delete el[el._throttleID];
    el._throttleID = null;
    delete el._throttleID;
  },
};

export default throttle;
