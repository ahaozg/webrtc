/**
 * @version 1.0.0
 * @author haozg
 * @createTime 2023/05/10
 * @updateTime 2023/05/10
 * @see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 * @description api路径
 */

const BASE_SERVER_URL = `${location.protocol}//${location.hostname}:${location.port}`;

const httpSuccessCodeMin = 200;
const httpSuccessCodeMax = 300;
export const apiSuccess = (code) => Number(code) >= httpSuccessCodeMin && Number(code) < httpSuccessCodeMax;
export const apiError = (params) => {
  console.error('apiError', params);
  // const defaultParams = {
  //   title: '请求失败，请重试',
  //   icon: 'none',
  //   duration: 2000
  // };
  // const result = params ? Object.assign(defaultParams, params) : defaultParams;
  // result.title && uni.showToast(result);
};

// 加载视频会议信息
export const apiMeeting = () => `${BASE_SERVER_URL}/api/v1/meeting`;
// 获取当前参会用户信息
export const apiUser = () => `${BASE_SERVER_URL}/api/v1/user`;
// 修改参会人信息
export const apiUpdate = (params) => `${BASE_SERVER_URL}/api/v1/user/update?roomId=${params.roomId}`;
// 获取当前参会用户列表
export const apiUserList = () => `${BASE_SERVER_URL}/api/v1/user/list`;
// 获取加入房间的token --- 七牛/腾讯的token
export const apiSignature = () => `${BASE_SERVER_URL}/api/v1/auth/signature`;
// 返回虚拟用户类型
export const apiVirtualType = () => `${BASE_SERVER_URL}/api/v1/virtual/type`;
// 获取房间授权认证的token --- 业务系统的token
export const apiToken = () => `${BASE_SERVER_URL}/api/v1/auth/token`;
// 获取当前登录用户的权限字
export const apiRight = () => `${BASE_SERVER_URL}/api/v1/right`;
// 校验参会人是否拥有指定权限
export const apiRightPost = () => `${BASE_SERVER_URL}/api/v1/right/user`;
// 离开房间
export const apiMeetingLeave = () => `${BASE_SERVER_URL}/api/v1/meeting/leave`;
// 直播状态
export const apiLivStatus = () => `${BASE_SERVER_URL}/api/v1/live/status`;
// 查询房间自定义数据
export const apiCustomData = () => `${BASE_SERVER_URL}/api/v1/data`;
// 添加房间自定义数据
export const apiCustomDataAdd = () => `${BASE_SERVER_URL}/api/v1/data/add`;
// 加载互动会议室配置信息
export const apiConferenceConfig = () => `${BASE_SERVER_URL}/api/v1/conference/config/`;
