import {StorageKeys} from '../constants/constant';

class RtcDeviceCamera {
  // 有没有设备
  has = false;
  // 是否连接
  connect = false;
  // 有没有权限
  hasAuth = false;
  // 设备信息
  device = null;
  // 设备id
  deviceId = window.localStorage.getItem(StorageKeys.cameraId) || '';
  // 设备列表
  deviceList = [];
  // 状态 正常/异常 (由用户自己选择)
  status = false;
  // 错误code
  errorCode = '';
  // 错误文案
  errorText = '';
  // 清晰度
  definitionList = [
    {
      id: 'ultraClear',
      label: '超清',
      data: {
        width: 1920,
        height: 1080,
        // 视频帧率
        frameRate: 15,
        bitrate: 2000,
        lowStreamConfig: {
          // 小流缩放比例，值为 2 表示小流分辨率是大流配置的 1/2
          scaleResolutionDownBy: 3,
          // 小流码率
          bitrate: 400,
        },
      },
      disabled: false,
    },
    {
      id: 'hd',
      label: '高清',
      data: {
        width: 1280,
        height: 720,
        // 视频帧率
        frameRate: 15,
        bitrate: 1500,
        lowStreamConfig: {
          // 小流缩放比例，值为 2 表示小流分辨率是大流配置的 1/2
          scaleResolutionDownBy: 2,
          // 小流码率
          bitrate: 150,
        },
      },
      disabled: false,
    },
    {
      id: 'sd',
      label: '标清',
      data: {
        width: 640,
        height: 360,
        // 视频帧率
        frameRate: 15,
        bitrate: 400,
        lowStreamConfig: {
          // 小流缩放比例，值为 2 表示小流分辨率是大流配置的 1/2
          scaleResolutionDownBy: 2,
          // 小流码率
          bitrate: 150,
        },
      },
      disabled: false,
    },
    {
      id: 'fluency',
      label: '流畅',
      data: {
        width: 320,
        height: 180,
        // 视频帧率
        frameRate: 15,
        bitrate: 150,
      },
      disabled: false,
    },
  ];

  // 当前选中的清晰度
  definitionId = window.localStorage.getItem(StorageKeys.definitionId) || 'hd';
}

export default RtcDeviceCamera;
