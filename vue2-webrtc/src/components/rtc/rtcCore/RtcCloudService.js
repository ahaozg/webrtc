import RtcCloud from './../rtcCloud/index';

class RtcCloudService {
  state = null;
  rtcCloud = null;
  constructor(state) {
    this.state = state;
    this.rtcCloud = RtcCloud.getRtcCloudInstance(state);
  }

  async checkSystemRequirements() {
    return await this.rtcCloud.checkSystemRequirements();
  }

  joinRoom(state = this.state) {
    return this.rtcCloud.joinRoom(state);
  }

  exitRoom() {
    return this.rtcCloud.exitRoom();
  }

  destroy() {
    this.rtcCloud.destroy();
  }

  publishMicStream(ops) {
    this.rtcCloud.publishMicStream(ops);
  }

  publishCameraStream(ops) {
    this.rtcCloud.publishCameraStream(ops);
  }

  hasLocalStreamAudio() {
    return this.rtcCloud.hasLocalStreamAudio();
  }

  hasLocalStreamVideo() {
    return this.rtcCloud.hasLocalStreamVideo();
  }

  setLocalStreamMute(ops) {
    return this.rtcCloud.setLocalStreamMute(ops);
  }

  setMicInterval() {
    return this.rtcCloud.setMicInterval();
  }

  clearMicInterval() {
    return this.rtcCloud.clearMicInterval();
  }

  switchMic() {
    return this.rtcCloud.switchMic();
  }

  switchCamera() {
    return this.rtcCloud.switchCamera();
  }

  switchDevice() {
    return this.rtcCloud.switchDevice();
  }
}

export default RtcCloudService;
