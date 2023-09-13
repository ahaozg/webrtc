/**
 * @version 1.0.0
 * @author haozg
 * @createTime 2023/5/8
 * @updateTime 2023/5/8
 * @see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 * @description rtc简单store
 */

import logger from './../common/logger/index';

const logPrefix = '[room-store]';

const room = {
  debug: process.env.DEPLOY_ENV_NO_CONSOLE === '',
  showLog(key, ...values) {
    if (this.debug) {
      logger.log(`${logPrefix}---->${key}`, ...values);
    }
  },

  roomInfo: {
    roomId: '',
    userId: '',
    roomName: '',
  },
  setRoomInfo(data) {
    this.showLog('setRoomInfo', data);
    this.roomInfo = data;
  },

  users: [],
  currentUser: {},
  setUsers(users = []) {
    this.showLog('setUsers', users);
    const currentUser = users.find(u => u.userId === this.roomInfo.userId);
    this.currentUser = currentUser || {};
    this.users = users;
  },
};

export default room;
