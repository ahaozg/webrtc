import {MixinsClass} from '../utils/utils';
import BaseCommon from './BaseCommon';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';
import emitter, {RtcCoreEvents} from '../common/emitter/event';

const logPrefix = '[RtcCloud-Mic]';

class Mic extends MixinsClass(BaseCommon) {
  //
  publishMicStreamSuccessCbs = [];
  publishMicStreamErrorCbs = [];

  // eslint-disable-next-line no-magic-numbers
  micIntervalTime = 500;
  micIntervalTimer = null;

  publishMicStream({
    userId,
    mute = true,
    microphoneId,
    successCb,
    errorCb,
  }) {
    const len = this.state.microphone.deviceList.length;
    logger.log(`${logPrefix}.publishMicStream`, len === 0 ? '暂无麦克风设备' : '有麦克风设备');
    if (successCb) {
      this.publishMicStreamSuccessCbs.push(successCb);
    }
    if (errorCb) {
      this.publishMicStreamErrorCbs.push(errorCb);
    }
    if (this.state.microphone.deviceList.length === 0) {
      this.publishMicStreamErrorHandler({
        code: RoomErrorCode.NOT_FOUND_MIC_ERROR,
        message: RoomErrorMessage.NOT_FOUND_MIC_ERROR,
      });
      return;
    }

    return this.publishStream({
      userId,
      tag: StreamTag.MIC,
      microphoneId,
      mute,
      successCb: () => {
        this.publishMicStreamSuccessHandler();
      },
      errorCb: (e) => {
        this.publishMicStreamErrorHandler(e);
      },
    });
  }

  publishMicStreamSuccessHandler() {
    this.playStream({
      successCb: () => {
        const currentUser = this.state.users.find(u => u.userId === this.userId);
        if (currentUser && currentUser.micOpen) {
          this.setMicInterval();
        }
      },
    });
    this.publishMicStreamSuccessCbs.forEach(cb => {
      cb && cb();
    });
    this.publishMicStreamSuccessCbs = [];
  }

  publishMicStreamErrorHandler(data) {
    this.publishMicStreamErrorCbs.forEach(cb => {
      cb && cb(data);
    });
    this.publishMicStreamErrorCbs = [];
  }

  switchMic(microphoneId) {
    this.switchDevice('audio', microphoneId);
  }

  setMicInterval() {
    this.clearMicInterval();
    this.micIntervalTimer = window.setTimeout(() => {
      if (this.localStream) {
        const mic = this.localStream.hasAudio();
        if (mic) {
          const level = this.amplifySound(Number(this.localStream.getAudioLevel()));
          console.log('level', level);
          emitter.emit(RtcCoreEvents.SET_USER_INFO, {
            userId: this.userId,
            micLevel: level,
          });
        }
      }
      this.setMicInterval();
    }, this.micIntervalTime);
  }

  clearMicInterval() {
    window.clearTimeout(this.micIntervalTimer);
  }

  amplifySound(level) {
    console.log('amplifySound', level);
    const percent = 100;
    const newLevel = level >= 1 ? level / percent : level;
    const maxLevel = 0.8;
    // 系数
    const coefficient = 0.3;
    // 占比
    const proportion = 0.8;
    let result = 0;
    if (newLevel >= coefficient) {
      result = proportion + (newLevel - coefficient) * (1 - proportion) / coefficient;
    } else {
      result = newLevel * proportion / coefficient;
    }
    return Math.min(result, maxLevel);
  }
}

export default Mic;
