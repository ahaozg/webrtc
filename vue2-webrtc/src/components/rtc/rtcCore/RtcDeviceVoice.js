import {StorageKeys} from '../constants/constant';

class RtcDeviceVoice {
  // 有没有设备
  has = false;
  // 是否连接
  connect = false;
  // 设备信息
  device = null;
  // 设备id
  deviceId = window.localStorage.getItem(StorageKeys.voiceId) || '';
  // 设备列表
  deviceList = [];
  // 状态 正常/异常 (由用户自己选择)
  status = false;
}

export default RtcDeviceVoice;
