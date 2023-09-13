class RtcDeviceNetwork {
  // 是否连接
  connect = false;
  // 结果
  result = null;
  // 状态
  status = 'UNKNOWN';
  // 状态文本
  statusText = '';
  rtt = '';
  packetLossRate = '';
  // 浏览器信息
  browser = null;
  // 系统信息
  OSInfo = null;
  // 浏览器是否支持
  isBrowserSupported = false
}

export default RtcDeviceNetwork;
