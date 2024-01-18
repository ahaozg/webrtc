import {MixinsClass} from '../utils/utils';
import BaseCommon from './BaseCommon';
import logger from '../common/logger';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../constants/constant';

const logPrefix = '[RtcCloud-Camera]';

class Camera extends MixinsClass(BaseCommon) {
  async publishCameraStream({
    userId,
    mute = true,
    cameraId,
    videoProfile,
  }) {
    const len = this.state.camera.deviceList.length;
    logger.log(`${logPrefix}.publishCameraStream`, len === 0 ? '暂无相机设备' : '有相机设备');

    if (this.state.camera.deviceList.length === 0) {
      const reason = {
        code: RoomErrorCode.NOT_FOUND_CAMERA_ERROR,
        message: RoomErrorMessage.NOT_FOUND_CAMERA_ERROR,
      };
      return Promise.reject(reason);
    }

    return await this.enqueuePublishStream({
      userId,
      tag: StreamTag.CAMERA,
      cameraId,
      videoProfile,
      mute,
    });
  }

  switchCamera(cameraId) {
    this.switchDevice('video', cameraId);
  }
}

export default Camera;
