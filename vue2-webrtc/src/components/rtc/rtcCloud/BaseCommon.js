import TRTC from 'trtc-js-sdk';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';
import {standardizationError} from '../utils/utils';
import RtcError from '../rtcCore/RtcError';

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
          throw RtcError.error(RoomErrorCode.INVALID_PARAM_ERROR, RoomErrorMessage.INVALID_PARAM_ERROR);
      }
      const localStream = this.TRTC.createStream(config);
      const isError = await localStream.initialize()
        .then(() => false)
        .catch(e => {
          standardizationError(e);
          logger.error(`${logPrefix}.localStream.initialize() e`, e, e.code, e.message, e.name);
          return this.streamInitializeError(e, e.name, config);
        });
      if (isError) {
        logger.error(`${logPrefix}.localStream.initialize()`, isError);
        throw RtcError.error(isError.code, isError.message, isError.data);
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
          throw RtcError.error(isErr.code, isErr.message, isErr.data);
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
            throw RtcError.error(RoomErrorCode.LOCAL_STREAM_PUBLISH_ERROR, RoomErrorMessage.LOCAL_STREAM_PUBLISH_ERROR, e);
          });
      }
      this.localStreamPublishing = false;
      console.log('end!!!');
    } catch (e) {
      logger.error(`${logPrefix}.publishStream try catch`, params, e);
      if (e.code && e.message) {
        throw RtcError.error(e.code, e.message, e.data);
      }
      standardizationError(e);
      this.localStreamPublishing = false;
      throw RtcError.error(RoomErrorCode.UNKNOWN_ERROR, RoomErrorMessage.UNKNOWN_ERROR, e);
    }
  }

  streamInitializeError(config, errorType, e) {
    const errorMap = {
      NotAllowedError: {
        code: config.audio
          ? config.video
            ? RoomErrorCode.CAMERA_MIC_USER_DENY
            : RoomErrorCode.MIC_USER_DENY
          : config.video
            ? RoomErrorCode.CAMERA_USER_DENY
            : RoomErrorCode.UNKNOWN_ERROR,
        message: config.audio
          ? config.video
            ? RoomErrorMessage.CAMERA_MIC_USER_DENY
            : RoomErrorMessage.MIC_USER_DENY
          : config.video
            ? RoomErrorMessage.CAMERA_USER_DENY
            : RoomErrorMessage.UNKNOWN_ERROR,
      },
      NotReadableError: {
        code: config.audio
          ? config.video
            ? RoomErrorCode.CAMERA_MIC_IN_USER
            : RoomErrorCode.MIC_IN_USER
          : config.video
            ? RoomErrorCode.CAMERA_IN_USER
            : RoomErrorCode.UNKNOWN_ERROR,
        message: config.audio
          ? config.video
            ? RoomErrorMessage.CAMERA_MIC_IN_USER
            : RoomErrorMessage.MIC_IN_USER
          : config.video
            ? RoomErrorMessage.CAMERA_IN_USER
            : RoomErrorMessage.UNKNOWN_ERROR,
      },
      RtcError: {
        // eslint-disable-next-line no-magic-numbers
        code: e.getCode() === 4099
          ? config.audio
            ? config.video
              ? RoomErrorCode.NOT_FOUND_DEVICE_ERROR
              : RoomErrorCode.NOT_FOUND_MIC_ERROR
            : config.video
              ? RoomErrorCode.NOT_FOUND_CAMERA_ERROR
              : RoomErrorCode.UNKNOWN_ERROR
          : RoomErrorCode.UNKNOWN_ERROR,
        // eslint-disable-next-line no-magic-numbers
        message: e.getCode() === 4099
          ? config.audio
            ? config.video
              ? RoomErrorMessage.NOT_FOUND_DEVICE_ERROR
              : RoomErrorMessage.NOT_FOUND_MIC_ERROR
            : config.video
              ? RoomErrorMessage.NOT_FOUND_CAMERA_ERROR
              : RoomErrorMessage.UNKNOWN_ERROR
          : RoomErrorMessage.UNKNOWN_ERROR,
      },
      default: {
        code: RoomErrorCode.UNKNOWN_ERROR,
        message: RoomErrorMessage.UNKNOWN_ERROR,
      },
    };
    const {code, message} = errorMap[errorType] || errorMap.default;
    return {
      code,
      message,
      data: e,
    };
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
    if (this.localStream) {
      logger.error(`${logPrefix}.updateLocalStream localStream不能为null`);
      reject(RtcError.error(RoomErrorCode.LOCAL_STREAM_UPDATE_ERROR, RoomErrorMessage.LOCAL_STREAM_UPDATE_ERROR));
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
          reject(RtcError.error(RoomErrorCode.LOCAL_STREAM_UPDATE_ERROR, RoomErrorMessage.LOCAL_STREAM_UPDATE_ERROR, err));
        });
    } else {
      logger.error(`${logPrefix}.updateLocalStream 参数异常`, {newTrack, isAudio, isVideo});
      reject(RtcError.error(RoomErrorCode.INVALID_PARAM_ERROR, RoomErrorMessage.INVALID_PARAM_ERROR));
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
