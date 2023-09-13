/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
import Vue from 'vue';
// 路由插件
import Router from 'vue-router';

// 使用路由
Vue.use(Router);
// 导出路由模块
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/rtc',
    },
    {
      path: '/rtc',
      name: 'rtc',
      component: () => import('@/pages/rtc/index.vue'),
    },
  ],
});
