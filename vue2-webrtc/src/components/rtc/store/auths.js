/**
 * @version 1.0.0
 * @author haozg
 * @createTime 2023/5/8
 * @updateTime 2023/5/8
 * @see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 * @description rtc简单store
 */

import logger from './../common/logger/index';

const logPrefix = '[auth-store]';

const auths = {
  debug: process.env.DEPLOY_ENV_NO_CONSOLE === '',
  showLog(key, ...values) {
    if (this.debug) {
      logger.log(`${logPrefix}---->${key}`, ...values);
    }
  },

  authSetting: true,
  setAuthSetting(auth) {
    const result = typeof auth === 'undefined' ? true : Boolean(auth);
    this.showLog('setAuthSetting', result);
    this.authSetting = result;
  },

  authMic: true,
  setAuthMic(auth) {
    const result = typeof auth === 'undefined' ? true : Boolean(auth);
    this.showLog('setAuthMic', result);
    this.authMic = result;
  },
};

export default auths;
