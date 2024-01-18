import TRTC from 'trtc-js-sdk';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';
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

  async checkSystemRequirements() {
    return await this.TRTC.checkSystemRequirements();
  }

  publishStreamQueue = Promise.resolve();
  enqueuePublishStream(params) {
    const result = this.publishStreamQueue.then(() => this.publishStream(params));
    this.publishStreamQueue = result.catch(() => {
      //
    });
    return result;
  }

  async publishStream(params) {
    const {
      userId,
      tag,
      microphoneId,
      cameraId,
      videoProfile,
      mute = true,
      audioSource,
      videoSource,
    } = params;
    try {
      logger.log(`${logPrefix}.publishStream`, params);
      if (this.localStreamPublishing) {
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
          logger.error(`${logPrefix}.publishStream ${RoomErrorMessage.INVALID_PARAM_ERROR}`, params, tag);
          throw {
            code: RoomErrorCode.INVALID_PARAM_ERROR,
            message: RoomErrorMessage.INVALID_PARAM_ERROR,
          };
      }
      const localStream = this.TRTC.createStream(config);
      const isError = await localStream.initialize()
        .then(() => false)
        .catch(e => {
          standardizationError(e);
          logger.error(`${logPrefix}.localStream.initialize() e`, e, e.code, e.message, e.name);
          switch (e.name) {
            case 'NotAllowedError':
              // 提示用户：提示用户不授权摄像头/麦克风访问无法进行音视频通话
              if (config.audio) {
                return {
                  code: RoomErrorCode.MIC_USER_DENY,
                  message: RoomErrorMessage.MIC_USER_DENY,
                  data: e,
                };
              } else if (config.video) {
                return {
                  code: RoomErrorCode.CAMERA_USER_DENY,
                  message: RoomErrorMessage.CAMERA_USER_DENY,
                  data: e,
                };
              }
              return {
                code: RoomErrorCode.CAMERA_MIC_USER_DENY,
                message: RoomErrorMessage.CAMERA_MIC_USER_DENY,
                data: e,
              };
            case 'NotReadableError':
              // 提示用户：暂时无法访问摄像头/麦克风，请确保当前没有其他应用请求访问摄像头/麦克风，并重试。
              if (config.audio) {
                return {
                  code: RoomErrorCode.MIC_IN_USER,
                  message: RoomErrorMessage.MIC_IN_USER,
                  data: e,
                };
              } else if (config.video) {
                return {
                  code: RoomErrorCode.CAMERA_IN_USER,
                  message: RoomErrorMessage.CAMERA_IN_USER,
                  data: e,
                };
              }
              return {
                code: RoomErrorCode.CAMERA_MIC_IN_USER,
                message: RoomErrorMessage.CAMERA_MIC_IN_USER,
                data: e,
              };
            case 'RtcError':
              // DEVICE_NOT_FOUND
              // eslint-disable-next-line no-magic-numbers
              if (e.getCode() === 4099) {
                // 当前设备没有麦克风或没有摄像头，但尝试采集麦克风、摄像头。
                // 处理建议：引导用户检查设备的摄像头及麦克风是否正常，业务侧应在进房前的进行设备检测。
                if (config.audio) {
                  return {
                    code: RoomErrorCode.NOT_FOUND_MIC_ERROR,
                    message: RoomErrorMessage.NOT_FOUND_MIC_ERROR,
                    data: e,
                  };
                } else if (config.video) {
                  return {
                    code: RoomErrorCode.NOT_FOUND_CAMERA_ERROR,
                    message: RoomErrorMessage.NOT_FOUND_CAMERA_ERROR,
                    data: e,
                  };
                }
                return {
                  code: RoomErrorCode.NOT_FOUND_DEVICE_ERROR,
                  message: RoomErrorMessage.NOT_FOUND_DEVICE_ERROR,
                  data: e,
                };
              }
              return {
                code: RoomErrorCode.UNKNOWN_ERROR,
                message: RoomErrorMessage.UNKNOWN_ERROR,
                data: e,
              };
            default:
              return {
                code: RoomErrorCode.UNKNOWN_ERROR,
                message: RoomErrorMessage.UNKNOWN_ERROR,
                data: e,
              };
          }
        });
      if (isError) {
        logger.error(`${logPrefix}.localStream.initialize()`, isError);
        // return reject(isError);
        // throw isError;
        throw Object.assign(new Error(isError.message), isError);
      }
      if (!this.localStream) {
        logger.log(`${logPrefix}.publish 开始发布`, params.tag);
        this.localStream = localStream;
      } else {
        logger.log(`${logPrefix}.publish 开始更新`, params.tag);
        const isAudio = tag === StreamTag.MIC || (tag === StreamTag.CUSTOM && audioSource);
        const isVideo = tag === StreamTag.CAMERA || (tag === StreamTag.CUSTOM && videoSource);
        const newTrack = isAudio ? localStream.getAudioTrack() : localStream.getVideoTrack();
        const isErr = await this.updateLocalStream({
          newTrack,
          isAudio,
          isVideo,
        })
          .then(() => false)
          .catch(e => e);
        if (isErr) {
          // return reject(isErr);
          throw isErr;
        }
      }
      this.setLocalStreamMute(params);
      if (!this.localStreamPublishState) {
        await this.client.publish(this.localStream)
          .then(() => {
            logger.log(`${logPrefix}.publish 发布成功`, params.tag);
            this.localStreamPublishState = true;
            this.localStreamPublishing = false;
            console.log('resolve !!!');
            // resolve();
          })
          .catch(e => {
            standardizationError(e);
            logger.error(`${logPrefix}.publish 发布失败`, params.tag, e);
            this.localStreamPublishState = false;
            this.localStreamPublishing = false;
            const reason = {
              code: RoomErrorCode.LOCAL_STREAM_PUBLISH_ERROR,
              message: RoomErrorMessage.LOCAL_STREAM_PUBLISH_ERROR,
              data: e,
            };
            // reject(reason);
            throw reason;
          });
      }
      this.localStreamPublishing = false;
      console.log('end!!!');
    } catch (e) {
      logger.error(`${logPrefix}.publishStream try catch`, params, e);
      if (e.code && e.message) {
        throw e;
      }
      standardizationError(e);
      this.localStreamPublishing = false;
      throw {
        code: RoomErrorCode.UNKNOWN_ERROR,
        message: RoomErrorMessage.UNKNOWN_ERROR,
        data: e,
      };
    }
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

  setLocalStreamMute({
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
