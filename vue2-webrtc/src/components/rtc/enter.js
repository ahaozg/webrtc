/**
 *@file index
 *@version 1.0.1
 *@author haozg
 *@createTime 2023/04/23 - 11:00
 *@updateTime 2023/04/23 - 11:00
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description rtc聊天室组件
 */
// 引入组件
import rtc from './index.vue';

import calcGrid1 from './utils/calcGrid1';
import calcGrid2 from './utils/calcGrid2';

// const install = function (Vue) {
//   // 全局注册
//   Vue.component('cc-rtc', rtc);
// };
// // auto install
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
// const API = {
//   install,
//   rtc,
// };
export const calcGrid = {
  calcGrid1,
  calcGrid2,
};

// vue es6模块写法
export default rtc;
// CommonJS模块规范
// module.exports.default = module.exports = API;
