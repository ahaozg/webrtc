import {UserRole} from '../constants/constant';

class RtcUserInfo {
  userId = '';
  tagName = '';
  // 用户角色
  role = UserRole.AUDIENCE;
  // 是否有视频流
  isVideoStreamAvailable = false;
  // 是否有音频流
  isAudioStreamAvailable = false;
  // 是否有屏幕分享流
  isScreenStreamAvailable = false;
  // 是否订阅视频流
  isVideoStreamSubscribed = false;
  // 是否订阅音频流
  isAudioStreamSubscribed = false;
  // 是否订阅屏幕分享流
  isScreenStreamSubscribed = false;

  micOpen = false;
  micLevel = 0;

  cameraOpen = false;

  // 位置信息
  positions = null;

  // 流类型
  // 'main' 主音视频流。通常是摄像头和麦克风流。
  // 'auxiliary' 辅助视频流，通常是一个屏幕分享流。
  // streamType = 'main';
  // 是否有辅流
  hasAux = false;

  reset() {
    this.userId = '';
    this.tagName = '';
    this.role = UserRole.AUDIENCE;
    this.isVideoStreamAvailable = false;
    this.isAudioStreamAvailable = false;
    this.isScreenStreamAvailable = false;
    this.isVideoStreamSubscribed = false;
    this.isAudioStreamSubscribed = false;
    this.isScreenStreamSubscribed = false;
    this.positions = null;
  }
}

export default RtcUserInfo;
