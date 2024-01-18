import RtcStore from './RtcStore';
import RtcCloudService from './RtcCloudService';
import RtcDeviceService from './RtcDeviceService';

import emitter, {RtcCoreEvents} from '../common/emitter/event';
import logger from '../common/logger';

const logPrefix = '[RtcCore]';

class RtcCore {
  static instance = null;

  state = null;
  rtcCloudService = null;
  rtcDeviceService = null;

  /**
   * 获取单例实例
   * @return {RtcCore} RtcCore的实例
   */
  static getInstance() {
    if (!RtcCore.instance) {
      RtcCore.instance = new RtcCore();
    }
    return RtcCore.instance;
  }

  /**
   * 销毁单例实例
   * @return {void}
   */
  static destroyInstance() {
    if (RtcCore.instance !== null) {
      RtcCore.instance.destroy();
      RtcCore.instance = null;
    }
  }

  constructor() {
    this.state = new RtcStore();
    this.rtcCloudService = new RtcCloudService(this.state);
    this.rtcDeviceService = new RtcDeviceService(this.state, this.rtcCloudService);
    this.handleUserJoin = this.handleUserJoin.bind(this);
    this.handleUserLeave = this.handleUserLeave.bind(this);
    this.setStateUsers = this.setStateUsers.bind(this);
    this.bindEvent();
  }

  bindEvent() {
    this.on(RtcCoreEvents.USER_JOIN, this.handleUserJoin);
    this.on(RtcCoreEvents.USER_LEAVE, this.handleUserLeave);
    this.on(RtcCoreEvents.SET_USER_INFO, this.setStateUsers);
  }

  unbindEvent() {
    this.off(RtcCoreEvents.USER_JOIN, this.handleUserJoin);
    this.off(RtcCoreEvents.USER_LEAVE, this.handleUserLeave);
    this.off(RtcCoreEvents.SET_USER_INFO, this.setStateUsers);
  }

  async checkSystemRequirements() {
    return await this.rtcCloudService.checkSystemRequirements();
  }

  /**
   * 注册事件监听
   * @param {string} event - 事件名称
   * @param {function} fn - 回调函数
   * @param {ctx} ctx - 上下文
   * @return {void}
   */
  on(event, fn, ctx = null) {
    emitter.on(event, fn, ctx);
  }

  /**
   * 取消事件监听
   * @param {string} event - 事件名称
   * @param {function} fn - 回调函数
   * @return {void}
   */
  off(event, fn) {
    emitter.off(event, fn);
  }

  destroy() {
    this.unbindEvent();
    this.state.reset();
    this.rtcCloudService.destroy();
    this.rtcDeviceService.reset();
  }

  joinRoom(options) {
    return new Promise((resolve, reject) => {
      ({
        mode: this.state.mode,
        sdkAppId: this.state.sdkAppId,
        userSig: this.state.userSig,
        roomId: this.state.roomId,
        userId: this.state.userId,
        useStringRoomId: this.state.useStringRoomId,
        autoSubscribe: this.state.autoSubscribe,
        enableAutoPlayDialog: this.state.enableAutoPlayDialog,
        enableMic: this.state.enableMic,
        enableCamera: this.state.enableCamera,
        enableScreenShare: this.state.enableScreenShare,
      } = options);
      this.rtcCloudService.joinRoom().then(async () => {
        this.state.joinRoomSuccess = true;
        resolve();
        if (this.state.enableMic && this.state.microphone.has) {
          await this.publishMicStream({
            userId: this.state.userId,
            microphoneId: this.state.microphone.deviceId,
          })
            .catch(e => {
              logger.error(`${logPrefix}.publishMicStream error：`, e, e.code, e.message, e.data);
            });
        }
        if (this.state.enableCamera && this.state.camera.has) {
          await this.publishCameraStream({
            userId: this.state.userId,
            cameraId: this.state.camera.deviceId,
          })
            .catch(e => {
              logger.error(`${logPrefix}.publishCameraStream error：`, e, e.code, e.message, e.data);
            });
        }
      })
        .catch(e => {
          this.state.joinRoomSuccess = false;
          reject(e);
        });
    });
  }

  exitRoom() {
    return this.rtcCloudService.exitRoom();
  }

  handleUserJoin(user) {
    emitter.emit(RtcCoreEvents.USER_JOIN_EXTEND, {
      user: this.setStateUsers(user),
      users: this.state.users,
    });
  }

  setStateUsers(user) {
    return this.state.setUsers(user);
  }

  handleUserLeave(user) {
    emitter.emit(RtcCoreEvents.USER_LEAVE_EXTEND, {
      user: this.delStateUsers(user),
      users: this.state.users,
    });
  }

  delStateUsers(user) {
    return this.state.delUsers(user);
  }

  async publishMicStream(ops) {
    await this.rtcCloudService.publishMicStream(ops);
  }

  async publishCameraStream(ops) {
    await this.rtcCloudService.publishCameraStream(ops);
  }

  hasLocalStreamAudio() {
    return this.rtcCloudService.hasLocalStreamAudio();
  }

  hasLocalStreamVideo() {
    return this.rtcCloudService.hasLocalStreamVideo();
  }

  setLocalStreamMute(ops) {
    return this.rtcCloudService.setLocalStreamMute(ops);
  }
}

export default RtcCore;
