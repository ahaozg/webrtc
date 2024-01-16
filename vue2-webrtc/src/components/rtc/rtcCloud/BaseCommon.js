import TRTC from 'trtc-js-sdk';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';
import emitter, {RtcCoreEvents} from '../common/emitter/event';
import {standardizationError} from '../utils/utils';

// 输出 DEBUG 以上日志等级
TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.ERROR);

const logPrefix = '[BaseCommon]';

class BaseCommon {
  TRTC = TRTC;
  client = null;

  state = null;

  roomId = '';
  userId = '';

  localStream = null;
  localStreamPublishState = false;
  localStreamPublishing = false;
  shareStream = null;

  remoteStreams = new Map();

  publishStreamQueue = [];

  async checkSystemRequirements() {
    return await this.TRTC.checkSystemRequirements();
  }

  publishStream(params) {
    return new Promise(async (resolve, reject) => {
      const {
        userId,
        // StreamTag
        tag,
        microphoneId,
        cameraId,
        videoProfile,
        // eslint-disable-next-line no-unused-vars
        mute = true,
        audioSource,
        videoSource,
        successCb,
        errorCb,
      } = params;
      try {
        logger.log(`${logPrefix}.publishStream`, params);
        if (this.localStreamPublishing) {
          errorCb && errorCb({
            code: RoomErrorCode.LOCAL_STREAM_PUBLISHING,
            message: RoomErrorMessage.LOCAL_STREAM_PUBLISHING,
          });
          this.publishStreamQueue.push({
            params,
            resolve,
            reject,
          });
          return;
        }
        this.localStreamPublishing = true;
        const config = {userId};
        for (const key in params) {
          const keys = ['audio', 'video', 'audioSource', 'videoSource'];
          if (keys.includes(key) && typeof params[key] !== 'undefined') {
            config[key] = params[key];
          }
        }
        let isDefault = false;
        switch (tag) {
          case StreamTag.MIC:
            config.audio = true;
            config.video = false;
            config.microphoneId = microphoneId;
            break;
          case StreamTag.CAMERA:
            config.audio = false;
            config.video = true;
            config.cameraId = cameraId;
            break;
          case StreamTag.CUSTOM:
            config.audioSource = audioSource;
            config.videoSource = videoSource;
            break;
          case StreamTag.SHARE:
            break;
          default:
            isDefault = true;
            errorCb && errorCb({
              code: RoomErrorCode.INVALID_PARAM_ERROR,
              message: RoomErrorMessage.INVALID_PARAM_ERROR,
            });
            break;
        }
        if (isDefault) {
          return reject(new Error({
            code: RoomErrorCode.INVALID_PARAM_ERROR,
            message: RoomErrorMessage.INVALID_PARAM_ERROR,
          }));
        }
        console.log('111111111', config);
        const localStream = this.TRTC.createStream(config);
        console.log('2222222');
        await this.test();
        console.log('333333');
        const isError = await localStream.initialize().catch(e => {
          console.log('c444catch');
          standardizationError(e);
          switch (e.name) {
            case 'NotReadableError':
              // 提示用户：暂时无法访问摄像头/麦克风，请确保当前没有其他应用请求访问摄像头/麦克风，并重试。
              if (config.audio) {
                errorCb && errorCb({
                  code: RoomErrorCode.MIC_USER_DENY,
                  message: RoomErrorMessage.MIC_USER_DENY,
                  data: e,
                });
              } else if (config.video) {
                errorCb && errorCb({
                  code: RoomErrorCode.CAMERA_USER_DENY,
                  message: RoomErrorMessage.CAMERA_USER_DENY,
                  data: e,
                });
              } else {
                errorCb && errorCb({
                  code: RoomErrorCode.CAMERA_MIC_USER_DENY,
                  message: RoomErrorMessage.CAMERA_MIC_USER_DENY,
                  data: e,
                });
              }
              break;
            case 'RtcError':
              // DEVICE_NOT_FOUND
              // eslint-disable-next-line no-magic-numbers
              if (e.getCode() === 4099) {
                // 当前设备没有麦克风或没有摄像头，但尝试采集麦克风、摄像头。
                // 处理建议：引导用户检查设备的摄像头及麦克风是否正常，业务侧应在进房前的进行设备检测。
                if (config.audio) {
                  errorCb && errorCb({
                    code: RoomErrorCode.NOT_FOUND_MIC_ERROR,
                    message: RoomErrorMessage.NOT_FOUND_MIC_ERROR,
                    data: e,
                  });
                } else if (config.video) {
                  errorCb && errorCb({
                    code: RoomErrorCode.NOT_FOUND_CAMERA_ERROR,
                    message: RoomErrorMessage.NOT_FOUND_CAMERA_ERROR,
                    data: e,
                  });
                } else {
                  errorCb && errorCb({
                    code: RoomErrorCode.NOT_FOUND_DEVICE_ERROR,
                    message: RoomErrorMessage.NOT_FOUND_DEVICE_ERROR,
                    data: e,
                  });
                }
              } else {
                errorCb && errorCb({
                  code: RoomErrorCode.UNKNOWN_ERROR,
                  message: RoomErrorMessage.UNKNOWN_ERROR,
                  data: e,
                });
              }
              break;
            default:
              logger.error(`${logPrefix}.localStream.initialize()`, e);
              errorCb && errorCb({
                code: RoomErrorCode.UNKNOWN_ERROR,
                message: RoomErrorMessage.UNKNOWN_ERROR,
                data: e,
              });
              break;
          }
          return true;
        });
        console.log('44444');
        if (isError) {
          return;
        }
        if (!this.localStream) {
          logger.log(`${logPrefix}.publish 开始发布`, params.tag);
          this.localStream = localStream;
        } else {
          logger.log(`${logPrefix}.publish 开始更新`, params.tag);
          const isAudio = tag === StreamTag.MIC || (tag === StreamTag.CUSTOM && audioSource);
          const isVideo = tag === StreamTag.CAMERA || (tag === StreamTag.CUSTOM && videoSource);
          const newTrack = isAudio ? localStream.getAudioTrack() : localStream.getVideoTrack();
          await this.updateLocalStream({
            newTrack,
            isAudio,
            isVideo,
          });
        }
        await this.setLocalStreamMute(params);
        if (!this.localStreamPublishState) {
          await this.client.publish(this.localStream).then(() => {
            logger.log(`${logPrefix}.publish 发布成功`, params.tag);
            this.localStreamPublishState = true;
            successCb && successCb();
          })
            .catch(e => {
              standardizationError(e);
              logger.error(`${logPrefix}.publish 发布失败`, params.tag, e);
              this.localStreamPublishState = false;
              errorCb && errorCb({
                code: RoomErrorCode.LOCAL_STREAM_PUBLISH_ERROR,
                message: RoomErrorMessage.LOCAL_STREAM_PUBLISH_ERROR,
                data: e,
              });
            });
        }
        this.localStreamPublishing = false;
        resolve();
        if (this.publishStreamQueue.length) {
          const first = this.publishStreamQueue.shift();
          this.publishStream(first.params)
            .then(res => {
              first.resolve(res);
            })
            .catch(e => {
              first.reject(e);
            });
        }
      } catch (e) {
        console.log('eeeeeeeeeeee', e);
        standardizationError(e);
        this.localStreamPublishing = false;
        errorCb && errorCb({
          code: RoomErrorCode.UNKNOWN_ERROR,
          message: RoomErrorMessage.UNKNOWN_ERROR,
          data: e,
        });
      }
    });
  }

  async test() {
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('test');
        resolve();
      }, 1000);
    });
  }

  updateLocalStream(params) {
    return new Promise((resolve, reject) => {
      this.updateLocalStreamInterval(Date.now(), params, resolve, reject);
    });
  }

  updateLocalStreamInterval(timestamp, params, resolve, reject) {
    if (this.localStreamPublishState) {
      this.updateLocalStreamDone(params, resolve, reject);
    } else {
      // 还未发布流，则等待发布
      // 最多10s
      const maxTime = 10000;
      const timeInterval = 300;
      // 如果没有当前dom,那么300ms后再试试,做多试10s
      if (timestamp + maxTime >= Date.now()) {
        const temp = setTimeout(() => {
          window.clearTimeout(temp);
          this.updateLocalStreamInterval(timestamp, params, resolve, reject);
        }, timeInterval);
      }
    }
  }

  updateLocalStreamDone({newTrack, isAudio, isVideo}, resolve, reject) {
    if (!this.localStream) {
      logger.error(`${logPrefix}.updateLocalStream localStream不能为null`);
      reject({
        code: RoomErrorCode.LOCAL_STREAM_UPDATE_ERROR,
        message: RoomErrorMessage.LOCAL_STREAM_UPDATE_ERROR,
      });
      return;
    }
    let fn = '';
    if (isAudio) {
      const hasAudio = this.localStream.hasAudio();
      fn = hasAudio ? 'replaceTrack' : 'addTrack';
    } else if (isVideo) {
      const hasVideo = this.localStream.hasVideo();
      fn = hasVideo ? 'replaceTrack' : 'addTrack';
    }
    if (fn) {
      this.localStream[fn](newTrack).then(() => {
        logger.log(`${logPrefix}.updateLocalStream 更新成功`, {newTrack, isAudio, isVideo});
        // fixme: 是否需要通知外层
        // if (typeFun(this.emitFn) === 'function') {
        //   this.emitFn('localTracksChange', params.newTrack, params.thatTrack, 'update');
        // }
        resolve(newTrack);
      })
        .catch(err => {
          standardizationError(err);
          logger.error(`${logPrefix}.updateLocalStream 更新失败`, {newTrack, isAudio, isVideo}, err);
          reject({
            code: RoomErrorCode.LOCAL_STREAM_UPDATE_ERROR,
            message: RoomErrorMessage.LOCAL_STREAM_UPDATE_ERROR,
            data: err,
          });
        });
    } else {
      logger.error(`${logPrefix}.updateLocalStream 参数异常`, {newTrack, isAudio, isVideo});
      reject({
        code: RoomErrorCode.INVALID_PARAM_ERROR,
        message: RoomErrorMessage.INVALID_PARAM_ERROR,
      });
    }
  }

  async switchDevice(type, deviceId) {
    if (this.localStreamPublishState && this.localStream) {
      let fn = '';
      switch (type) {
        case 'audio':
          fn = 'hasLocalStreamAudio';
          break;
        case 'video':
          fn = 'hasLocalStreamVideo';
          break;
        default:
          logger.error(`${logPrefix}.switchDevice 参数错误`);
          break;
      }
      if (fn) {
        const hasTrack = this[fn]();
        hasTrack && await this.localStream.switchDevice(type, deviceId);
      }
    }
  }

  async setLocalStreamMute({
    tag,
    mute = true,
    audioSource,
    videoSource,
  }) {
    if (!this.localStream) {
      return false;
    }
    const isAudio = tag === StreamTag.MIC || (tag === StreamTag.CUSTOM && audioSource);
    const isVideo = tag === StreamTag.CAMERA || (tag === StreamTag.CUSTOM && videoSource);
    if (isAudio) {
      logger.log(`${logPrefix}.setLocalStreamMute 音频 ${mute ? '禁音频' : '取消禁音频'}`);
      mute ? this.localStream.muteAudio() : this.localStream.unmuteAudio();
    }
    if (isVideo) {
      logger.log(`${logPrefix}.setLocalStreamMute 视频 ${mute ? '禁视频' : '取消禁视频'}`);
      mute ? this.localStream.muteVideo() : this.localStream.unmuteVideo();
    }
    return true;
  }

  hasLocalStreamAudio() {
    return this.localStream?.hasAudio();
  }

  hasLocalStreamVideo() {
    return this.localStream?.hasVideo();
  }

  async playStream(params = {}, timestamp = Date.now()) {
    const {
      userId = this.userId,
      stream = this.localStream,
      successCb,
      errorCb,
      playOps = {},
    } = params;
    if (!stream) {
      errorCb && errorCb();
      return;
    }
    if (document.querySelector(`#user_${userId}`)) {
      logger.log(`${logPrefix}.playStream #user_${userId}，dom存在`);
      await stream.stop();
      await stream.play(`user_${userId}`, {playOps}).then(() => {
        logger.log(`${logPrefix}.playStream #user_${userId}，播放成功`);
        successCb && successCb();
      })
        .catch(err => {
          standardizationError(err);
          logger.error(`${logPrefix}.playStream #user_${userId}`, err);
          errorCb && errorCb(err);
        });
    } else {
      logger.log(`${logPrefix}.playStream #user_${userId}，没有dom`);
      // 还未发布流，则等待发布
      // 最多10s
      const maxTime = 500;
      const timeInterval = 300;
      // 如果没有当前dom,那么300ms后再试试,做多试10s
      if (timestamp + maxTime >= Date.now()) {
        const temp = setTimeout(() => {
          window.clearTimeout(temp);
          this.playStream(params, timestamp);
        }, timeInterval);
      }
    }
  }
}

export default BaseCommon;
