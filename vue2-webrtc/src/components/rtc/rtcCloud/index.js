import logger from '../common/logger';
import {MixinsClass, standardizationError} from '../utils/utils';
import emitter, {RtcCoreEvents} from '../common/emitter/event';
import BaseCommon from './BaseCommon';
import Mic from './Mic';
import Camera from './Camera';
const logPrefix = '[RtcCloud]';

class RtcCloud extends MixinsClass(
  BaseCommon,
  Mic,
  Camera,
) {
  static rtcCloudInstance = null;

  /**
   * 获取单例实例
   * @param {Object} state - 数据
   * @return {RtcCore} RtcCore的实例
   */
  static getRtcCloudInstance(state) {
    if (!RtcCloud.rtcCloudInstance) {
      RtcCloud.rtcCloudInstance = new RtcCloud(state);
    }
    return RtcCloud.rtcCloudInstance;
  }

  /**
   * 销毁单例实例
   * @return {void}
   */
  static destroyRtcCloudInstance() {
    if (RtcCloud.rtcCloudInstance !== null) {
      RtcCloud.rtcCloudInstance.destroy();
      RtcCloud.rtcCloudInstance = null;
    }
  }

  constructor(state) {
    super();
    logger.log(`${logPrefix}.constructor`, this, state);
    this.state = state;
    this.client = null;
    this.remoteStreams = new Map();
  }

  async destroy() {
    try {
      this.clearMicInterval();
      this.removeRoomEventListener();
      for (const remoteStream of this.remoteStreams.values()) {
        await this.client?.unsubscribe(remoteStream);
      }
      await this.client?.leave();
      this.client = null;
      this.state = null;
    } catch (e) {
      logger.error(`${logPrefix}.destroy`, e);
    }
  }

  joinRoom(state) {
    return new Promise((resolve, reject) => {
      this.createClient(state);
      this.setClientEventListener();
      this.roomId = state.roomId;
      this.client?.join({roomId: state.roomId})
        .then(() => {
          emitter.emit(RtcCoreEvents.USER_JOIN, {userId: this.userId});
          resolve();
        })
        .catch(error => {
          standardizationError(error);
          reject(error);
        });
    });
  }

  exitRoom() {
    return new Promise((resolve, reject) => {
      this.client?.leave().then(() => {
        emitter.emit(RtcCoreEvents.USER_LEAVE, {userId: this.userId});
        resolve();
      })
        .catch(error => {
          standardizationError(error);
          reject(error);
        });
    });
  }

  createClient(state) {
    if (!this.client) {
      const params = {
        mode: state.mode,
        sdkAppId: state.sdkAppId,
        userId: state.userId,
        userSig: state.userSig,
        useStringRoomId: state.useStringRoomId,
        autoSubscribe: state.autoSubscribe,
        enableAutoPlayDialog: state.enableAutoPlayDialog,
      };
      this.userId = state.userId;
      this.client = this.TRTC.createClient(params);
    }
  }

  setClientEventListener() {
    // 设置房间相关的监听处理

    // eslint-disable-next-line valid-jsdoc
    /**
     初始情况下，状态为 DISCONNECTED
     与房间建立连接过程中，状态变为 CONNECTING
     与房间连接成功后，状态变为 CONNECTED
     与房间断开连接后，状态再次变为 DISCONNECTED
     */
    this.client?.on('connection-state-changed', event => {
      logger.log(`${logPrefix}.connection-state-changed`, event);
    });
    // 被动退出房间事件
    this.client?.on('client-banned', event => {
      logger.log(`${logPrefix}.client-banned`, event);
      emitter.emit(RtcCoreEvents.USER_BANNED, event);
    });
    // 远端用户加入房间
    this.client?.on('peer-join', event => {
      logger.log(`${logPrefix}.peer-join`, event);
      emitter.emit(RtcCoreEvents.USER_JOIN, event);
    });
    // 远端用户离开房间
    this.client?.on('peer-leave', event => {
      logger.log(`${logPrefix}.peer-leave`, event);
      emitter.emit(RtcCoreEvents.USER_LEAVE, event);
    });
    // 用户添加媒体轨
    this.client?.on('stream-added', event => {
      logger.log(`${logPrefix}.stream-added`, event);
      emitter.emit(RtcCoreEvents.STREAM_ADDED, event);
    });
    // 用户移除媒体轨
    this.client?.on('stream-removed', event => {
      logger.log(`${logPrefix}.stream-removed`, event);
      emitter.emit(RtcCoreEvents.STREAM_REMOVED, event);
    });
    // 用户更新媒体轨
    this.client?.on('stream-updated', event => {
      logger.log(`${logPrefix}.stream-updated`, event);
      emitter.emit(RtcCoreEvents.STREAM_UPDATED, event);
    });
    // 远端流订阅成功事件
    this.client?.on('stream-subscribed', event => {
      logger.log(`${logPrefix}.stream-subscribed`, event);
      emitter.emit(RtcCoreEvents.STREAM_SUBSCRIBED, event);
    });
    // 远端用户禁用音频事件
    this.client?.on('mute-audio', event => {
      logger.log(`${logPrefix}.mute-audio`, event);
      emitter.emit(RtcCoreEvents.STREAM_AUDIO_MUTE, event);
    });
    // 远端用户启用音频事件
    this.client?.on('unmute-audio', event => {
      logger.log(`${logPrefix}.unmute-audio`, event);
      emitter.emit(RtcCoreEvents.STREAM_AUDIO_UNMUTE, event);
    });
    // 远端用户禁用视频事件
    this.client?.on('mute-video', event => {
      logger.log(`${logPrefix}.mute-video`, event);
      emitter.emit(RtcCoreEvents.STREAM_VIDEO_MUTE, event);
    });
    // 远端用户启用视频事件
    this.client?.on('unmute-video', event => {
      logger.log(`${logPrefix}.unmute-video`, event);
      emitter.emit(RtcCoreEvents.STREAM_VIDEO_UNMUTE, event);
    });
    // // 网络质量统计数据事件
    // this.client?.on('network-quality', event => {
    //   logger.log(`${logPrefix}.network-quality`, event);
    // });
    // // 房间发声者音量实时监测
    // this.client?.on('audio-volume', event => {
    //   logger.log(`${logPrefix}.audio-volume`, event);
    // });
    // 错误事件，当出现不可恢复错误后，会抛出此事件
    this.client?.on('error', event => {
      standardizationError(event);
      logger.log(`${logPrefix}.error`, event);
      emitter.emit(RtcCoreEvents.CLIENT_ERROR, event);
    });
  }

  removeRoomEventListener() {
    this.client?.off('*');
  }
}

export default RtcCloud;
