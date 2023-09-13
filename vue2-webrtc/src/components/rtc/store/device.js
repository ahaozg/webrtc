/**
 * @version 1.0.0
 * @author haozg
 * @createTime 2023/5/8
 * @updateTime 2023/5/8
 * @see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 * @description rtc简单store
 */

import logger from './../common/logger/index';

const logPrefix = '[device-store]';

const device = {
  debug: process.env.DEPLOY_ENV_NO_CONSOLE === '',
  showLog(key, ...values) {
    if (this.debug) {
      logger.log(`${logPrefix}---->${key}`, ...values);
    }
  },

  isBrowserSupported: false,
  setIsBrowserSupported(flag) {
    this.showLog('setIsBrowserSupported', flag);
    this.isBrowserSupported = flag;
  },

  // 是否获得浏览器的授权  -1 初始化  0 未获取  1已获取  2已拒绝
  hasDeviceAuth: -1,
  setHasDeviceAuth(step) {
    this.showLog('setHasDeviceAuth', step);
    this.hasDeviceAuth = step;
  },

  // // 本地音视频标识
  // localAudioOpen: false,
  // setLocalAudioOpen(data) {
  //   this.showLog('setLocalAudioOpen', data);
  //   this.localAudioOpen = data;
  // },
  // // 防止点击的标注
  // localAudioOpenPromise: 'pending',
  // setLocalAudioOpenPromise(data) {
  //   this.showLog('setLocalAudioOpenPromise', data);
  //   this.localAudioOpenPromise = data;
  // },
  // // 本地音频发布失败
  // localAudioOpenPublishErrorCode: '',
  // setLocalAudioOpenPublishErrorCode(data) {
  //   this.showLog('setLocalAudioOpenPublishErrorCode', data);
  //   this.localAudioOpenPublishErrorCode = data;
  // },
  //
  // localVideoOpen: false,
  // setLocalVideoOpen(data) {
  //   this.showLog('setLocalVideoOpen', data);
  //   this.localVideoOpen = data;
  // },
  // localVideoOpenPromise: 'pending',
  // setLocalVideoOpenPromise(data) {
  //   this.showLog('setLocalVideoOpenPromise', data);
  //   this.localVideoOpenPromise = data;
  // },
  // // 本地视频发布失败
  // localVideoOpenPublishErrorCode: '',
  // setLocalVideoOpenPublishErrorCode(data) {
  //   this.showLog('setLocalVideoOpenPublishErrorCode', data);
  //   this.localVideoOpenPublishErrorCode = data;
  // },

  // 屏幕共享点击的标识
  clickScreenVideoBtnFlag: false,
  setClickScreenVideoBtnFlag(data) {
    this.showLog('setClickScreenVideoBtnFlag', data);
    this.clickScreenVideoBtnFlag = data;
  },
  // 屏幕共享标识
  localScreenOpen: false,
  setLocalScreenOpen(data) {
    this.showLog('setLocalScreenOpen', data);
    this.localScreenOpen = data;
  },
  // 防止点击的标注
  localScreenOpenPromise: '',
  setLocalScreenOpenPromise(data) {
    this.showLog('setLocalScreenOpenPromise', data);
    this.localScreenOpenPromise = data;
  },
  // 本地屏幕共享发布失败
  localScreenOpenPublishErrorCode: '',
  setLocalScreenOpenPublishErrorCode(data) {
    this.showLog('setLocalScreenOpenPublishErrorCode', data);
    this.localScreenOpenPublishErrorCode = data;
  },
};

export default device;
