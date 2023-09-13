export const RoomErrorCode = {
  UNKNOWN_ERROR: -90000,
  INVALID_PARAM_ERROR: -90013,
  CHECK_SYSTEM_REQUIREMENTS: -90001,
  NOT_FOUND_DEVICE_ERROR: -90002,
  CAMERA_MIC_USER_DENY: -90003,
  NOT_FOUND_MIC_ERROR: -90009,
  MIC_USER_DENY: -90010,
  NOT_FOUND_CAMERA_ERROR: -90014,
  CAMERA_USER_DENY: -90015,
  CREATE_ROOM_PARAM_ERROR: -90004,
  CREATE_ROOM_ERROR: -90005,
  EXIT_ROOM_ERROR: -90006,
  USER_JOIN_EXTEND_ERROR: -90007,
  USER_LEAVE_EXTEND_ERROR: -90008,
  LOCAL_STREAM_PUBLISH_ERROR: -90011,
  LOCAL_STREAM_UPDATE_ERROR: -90012,
  LOCAL_STREAM_PUBLISHING: -90016,
  RTC_CLIENT_ERROR: -90017,

  // INVALID_PARAM_ERROR: -1000,
  // LOGIN_ERROR: -1001,
  // LOGOUT_ERROR: -1002,
  // NOT_LOGIN: -1003,
  // TIM_ERROR: -1004,
  // TRTC_NOT_EXIST_ERROR: -1005,
  // ROOM_EXISTED: -1006,
  // SDK_NOT_READY: -1007,
  // CREATE_GROUP_ERROR: -1008,
  // JOIN_GROUP_ERROR: -1009,
  // QUIT_GROUP_ERROR: -1010,
  // DISMISS_GROUP_ERROR: -1011,
  // SEND_MESSAGE_ERROR: -1012,
  // SEND_CUSTOM_MESSAGE_ERROR: -1013,
  // CREATE_ROOM_ERROR: -1014,
  // DESTROY_ROOM_ERROR: -1015,
  // ENTER_ROOM_ERROR: -1016,
  // EXIT_ROOM_ERROR: -1017,
  // SET_ROOM_CONTROL_CONFIG_ERROR: -1018,
  // GROUP_NOT_EXIST_ERROR: -1019,
  // CHANGE_ALL_MIC_MUTE_ERROR: -1020,
  // CHANGE_GROUP_OWNER: -1021,
  // WEB_SCREEN_SHARE_SYSTEM_DENY: -1022,
  // WEB_SCREEN_SHARE_USER_DENY: -1023,
  // WEB_SCREEN_SHARE_UNKNOWN: -1024,
  // GET_GROUP_MEMBER_PROFILE_ERROR: -1025,
  // CHANGE_ALL_CAMERA_MUTE_ERROR: -1026,
  // GET_GROUP_MEMBER_LIST_ERROR: -1027,
  // REPEAT_LOGIN_ERROR: -1028,
  //
  // ROOM_BEEN_DESTROYED: -1997,
  // NO_PRIVILEGE: -1998,
  // UNKNOWN_ERROR: -1999,
  //
  // CALLING_ROLL: -2000,
  // NOT_CALL_ROLL: -2001,
  // START_CALL_ROLL_ERROR: -2002,
  // STOP_CALL_ROLL_ERROR: -2003,
  // SEND_SPEECH_APPLICATION_EORRO: -2004,
  //
  // TS_INVITE_ERROR: -2010,
  // TS_CMD_ERROR: -2011
};

export const RoomErrorMessage = {
  UNKNOWN_ERROR: '未知错误',
  INVALID_PARAM_ERROR: '无效参数',
  CHECK_SYSTEM_REQUIREMENTS: '当前系统或浏览器不支持此组件',
  NOT_FOUND_DEVICE_ERROR: '未检测到摄像头和麦克风设备',
  CAMERA_MIC_USER_DENY: '用户拒绝/取消相机或者麦克风授权',
  NOT_FOUND_MIC_ERROR: '当前设备没有麦克风',
  MIC_USER_DENY: '用户拒绝/取消麦克风授权',
  NOT_FOUND_CAMERA_ERROR: '当前设备没有相机',
  CAMERA_USER_DENY: '用户拒绝/取消相机授权',
  CREATE_ROOM_PARAM_ERROR: '创建并进入房间参数错误',
  CREATE_ROOM_ERROR: '创建并进入房间失败',
  EXIT_ROOM_ERROR: '退出房间失败',
  USER_JOIN_EXTEND_ERROR: '加入用户触发的自定义扩展函数发送错误',
  USER_LEAVE_EXTEND_ERROR: '离开用户触发的自定义扩展函数发送错误',
  LOCAL_STREAM_PUBLISH_ERROR: '本地流推送失败',
  LOCAL_STREAM_UPDATE_ERROR: '本地流更新失败',
  LOCAL_STREAM_PUBLISHING: '正在发布音视频流，请稍等',
  RTC_CLIENT_ERROR: 'rtc client报错',

  // INVALID_PARAM_ERROR: '无效参数',
  // LOGIN_ERROR: '登录失败',
  // LOGOUT_ERROR: '登出失败',
  // LOGOUT_TIM_ERROR: '退出 TIM 失败',
  // LOGOUT_TRTC_ERROR: '退出 TRTC 房间失败',
  // NOT_LOGIN: '未登录',
  // TRTC_NOT_EXIST_ERROR: 'TRTC 实例未创建',
  // ROOM_EXISTED: '房间已存在',
  // SDK_NOT_READY: 'SDK 初始化未完成',
  // CREATE_GROUP_ERROR: '创建群组失败',
  // JOIN_GROUP_ERROR: '加入群组失败',
  // QUIT_GROUP_ERROR: '退出群组失败',
  // DISMISS_GROUP_ERROR: '解散群组失败',
  // SEND_MESSAGE_ERROR: '发送文本消息失败',
  // SEND_CUSTOM_MESSAGE_ERROR: '发送自定义消息失败',
  // CREATE_ROOM_ERROR: '创建房间失败',
  // DESTROY_ROOM_ERROR: '销毁房间失败',
  // ENTER_ROOM_ERROR: '进入房间失败',
  // EXIT_ROOM_ERROR: '退出房间失败',
  // ROOM_BEEN_DESTROYED: '房间实例已被销毁',
  // SET_ROOM_CONTROL_CONFIG_ERROR: '设置房间控制配置失败',
  // GROUP_NOT_EXIST_ERROR: '群组不存在',
  // CHANGE_ALL_MIC_MUTE_ERROR: '修改全员禁麦克风状态失败',
  // CHANGE_ALL_CAMERA_MUTE_ERROR: '修改全员禁画状态失败',
  // CHANGE_GROUP_OWNER: '转移群失败',
  // WEB_SCREEN_SHARE_SYSTEM_DENY: '系统禁止当前浏览器获取屏幕内容',
  // WEB_SCREEN_SHARE_USER_DENY: '用户拒绝/取消屏幕分享',
  // WEB_SCREEN_SHARE_UNKNOWN: '屏幕分享遇到未知错误',
  // GET_GROUP_MEMBER_PROFILE_ERROR: '获取群成员信息失败',
  // GET_GROUP_MEMBER_LIST_ERROR: '获取群成员列表失败',
  // NO_PRIVILEGE: '无权限',
  // UNKNOWN_ERROR: '未知错误',
  // REPEAT_LOGIN_ERROR: '重复登录',
  //
  // CALLING_ROLL: '正在点名中',
  // NOT_CALL_ROLL: '尚未开始点名',
  // START_CALL_ROLL_ERROR: '开始点名失败',
  // STOP_CALL_ROLL_ERROR: '结束点名失败',
  // SEND_SPEECH_APPLICATION_EORRO: '申请发言失败',
  //
  // TS_INVITE_ERROR: '邀请信令已在流程中，请不要重复邀请',
  // TS_CMD_ERROR: '本次响应操作无对应邀请事件信令'
};

export const StreamTag = {
  MIC: 'Mic',
  CAMERA: 'Camera',
  CUSTOM: 'Custom',
  SHARE: 'Share',
};

export const TSignalingConfig = {
  timeout: 0,
};

export const TIM_ROOM_PREFIX = '';

// 角色类型
export const UserRole = {
  // 主持人，具有房间麦控管理能力，聊天能力和音视频能力 （IM-Owner + TRTC-Anchor）
  MASTER: 1,
  // 管理员，不具有音视频能力，具有群管理能力，无转交群能力。（IM-Owner + TRTC-Audience）
  MANAGER: 2,
  // 主播，有聊天能力和音视频能力（IM-Member+ TRTC-Anchor）
  ANCHOR: 3,
  // 观众，仅有聊天能力（IM-Member+ TRTC-Audience）
  AUDIENCE: 4,
};

export const NAME = {
  DEFAULT: 'default',
  VIDEO: 'video',
  AUDIO: 'audio',
  ON_ERROR: 'onError',
  MAIN: 'main',
  // 场景：音视频、直播
  RTC: 'rtc',
  LIVE: 'live',
  // 用户角色
  ANCHOR: 'anchor',
  AUDIENCE: 'audience',
  // 音频 profile
  AUDIO_STANDARD: 'standard',
  AUDIO_HIGH: 'high',
  AUDIO_STANDARD_STEREO: 'standard_stereo',
  AUDIO_HIGH_STEREO: 'high_stereo',
  // 音频 profile
  SMALL: 'small',
  BIG: 'big',
  AUXILIARY: 'auxiliary',
  // 屏幕分享用户名的前缀
  SCREEN_SHARE_USER_ID_PREFIX: 'share_',
  NUMBER: 'number',
};

export const StorageKeys = {
  cameraId: 'device_cameraId',
  microphoneId: 'device_microphoneId',
  voiceId: 'device_voiceId',
  microphoneVolume: 'device_microphone_volume',
  voiceVolume: 'device_voice_volume',
  definitionId: 'device_definitionId',
};
