import {MixinsClass} from '../utils/utils';
import BaseCommon from './BaseCommon';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';

const logPrefix = '[RtcCloud-Camera]';

class Camera extends MixinsClass(BaseCommon) {
  //
  publishCameraStreamSuccessCbs = [];
  publishCameraStreamErrorCbs = [];

  async publishCameraStream({
    userId,
    mute = true,
    cameraId,
    videoProfile,
    successCb,
    errorCb,
  }) {
    const len = this.state.camera.deviceList.length;
    logger.log(`${logPrefix}.publishCameraStream`, len === 0 ? '暂无相机设备' : '有相机设备');
    if (successCb) {
      this.publishCameraStreamSuccessCbs.push(successCb);
    }
    if (errorCb) {
      this.publishCameraStreamErrorCbs.push(errorCb);
    }
    if (this.state.camera.deviceList.length === 0) {
      this.publishCameraStreamErrorHandler({
        code: RoomErrorCode.NOT_FOUND_CAMERA_ERROR,
        message: RoomErrorMessage.NOT_FOUND_CAMERA_ERROR,
      });
      return;
    }

    return await this.publishStream({
      userId,
      tag: StreamTag.CAMERA,
      cameraId,
      videoProfile,
      mute,
      successCb: () => {
        this.publishCameraStreamSuccessHandler();
      },
      errorCb: (e) => {
        this.publishCameraStreamErrorHandler(e);
      },
    });
  }

  publishCameraStreamSuccessHandler() {
    this.playStream();
    this.publishCameraStreamSuccessCbs.forEach(cb => {
      cb && cb();
    });
    this.publishCameraStreamSuccessCbs = [];
  }

  publishCameraStreamErrorHandler(data) {
    this.publishCameraStreamErrorCbs.forEach(cb => {
      cb && cb(data);
    });
    this.publishCameraStreamErrorCbs = [];
  }

  switchCamera(cameraId) {
    this.switchDevice('video', cameraId);
  }
}

export default Camera;
