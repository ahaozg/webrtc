import {MixinsClass} from '../utils/utils';
import BaseCommon from './BaseCommon';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';
import emitter, {RtcCoreEvents} from '../common/emitter/event';

const logPrefix = '[RtcCloud-Mic]';

class Mic extends MixinsClass(BaseCommon) {
  // eslint-disable-next-line no-magic-numbers
  micIntervalTime = 500;
  micIntervalTimer = null;

  publishMicStream({
    userId,
    mute = true,
    microphoneId,
  }) {
    const len = this.state.microphone.deviceList.length;
    logger.log(`${logPrefix}.publishMicStream`, len === 0 ? '暂无麦克风设备' : '有麦克风设备');
    if (this.state.microphone.deviceList.length === 0) {
      const reason = {
        code: RoomErrorCode.NOT_FOUND_MIC_ERROR,
        message: RoomErrorMessage.NOT_FOUND_MIC_ERROR,
      };
      return Promise.reject(reason);
    }

    return this.enqueuePublishStream({
      userId,
      tag: StreamTag.MIC,
      microphoneId,
      mute,
    });
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
