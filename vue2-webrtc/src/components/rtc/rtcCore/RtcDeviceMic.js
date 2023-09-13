import {StorageKeys} from '../constants/constant';

class RtcDeviceMic {
  // 有没有设备
  has = false;
  // 是否连接
  connect = false;
  // 有没有权限
  hasAuth = false;
  // 设备信息
  device = null;
  // 设备id
  deviceId = window.localStorage.getItem(StorageKeys.microphoneId) || '';
  // 设备列表
  deviceList = [];
  // 状态 正常/异常 (由用户自己选择)
  status = false;
  // 音量
  volume = 0;
  // 音量定时器
  volumeInterval = null;
  // 错误code
  errorCode = '';
  // 错误文案
  errorText = ''
}

export default RtcDeviceMic;
