/**
 *@file index
 *@version 1.0.1
 *@author haozg
 *@createTime 2019/9/10 - 15:59
 *@updateTime 2019/9/10 - 15:59
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description 上传组件
 */
// 引入组件
import poptip from './index.vue';
import logger from './../../../common/logger/index';

const logPrefix = '[install]';

const install = function (Vue) {
  logger.log(`${logPrefix} 全局【vcc-poptip】组件注册成功， 可以使用！`);
  // 全局注册
  Vue.component('vcc-poptip', poptip);
};
// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
const API = {
  install,
  poptip: poptip,
};

// window.vccFixNav = API;
// vue es6模块写法
export default API;
// CommonJS模块规范
// module.exports.default = module.exports = API;
