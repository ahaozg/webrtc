/**
 *@file debounce
 *@version 1.0.0
 *@author haozg
 *@createTime 2021/01/22
 *@updateTime 2021/01/22
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description debounce 防抖 主要用于按钮的防抖
 */
import getUUID from './getUUID';

const defaultTime = 300;

/**
 * 防抖 单位时间只触发最后一次
 *  @param {?Number|defaultTime} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|'click'} event - 事件类型 例：'click'
 *  @param {Array} binding.value - [fn,event,time]
 *  @example
 *  例：<button v-debounce="[reset,`click`,300]">刷新</button>
 *  也可简写成：<button v-debounce="[reset]">刷新</button>
 *  传递参数则：<button v-debounce="[()=>reset(param),`click`,300]">刷新</button>
 */
const debounce = {
  inserted: function (el, binding) {
    const [fn, event = 'click', time = defaultTime] = binding.value;
    let timer = null;
    el._debounceID = `debounce${getUUID()}`;
    el.addEventListener(event, el[el._debounceID] = () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => fn(), time);
    });
  },
  update: function (el, binding) {
    const [fn, event = 'click', time = defaultTime] = binding.value;
    let timer = null;
    el.removeEventListener(event, el[el._debounceID]);
    el.addEventListener(event, el[el._debounceID] = () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => fn(), time);
    });
  },
  unbind(el, binding) {
    const [event = 'click'] = binding.value;
    el.removeEventListener(event, el[el._debounceID]);
    el[el._debounceID] = null;
    delete el[el._debounceID];
    el._debounceID = null;
    delete el._debounceID;
  },
};
export default debounce;
