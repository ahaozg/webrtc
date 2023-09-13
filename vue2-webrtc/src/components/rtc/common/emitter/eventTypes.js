/**
 * 为防止重复冲突
 * 除UIEvents外，其余的事件名称都需要加模块名，eg：rtc_core_xxx
 */

export const UIEvents = {
  ERROR: 'error',
  SDK_ERROR: 'sdk_error',
  CHANGE_DEVICE: 'change_device',
  CHANGE_DEVICE_ID: 'change_device_id',
  USER_TIP_MESSAGE: 'user_tip_message',
  CHANGE_USER_ARRAY: 'change_user_array',
  WINDOW_RESIZE: 'window_resize',
};

export const RtcCoreEvents = {
  CLIENT_ERROR: 'rtc_core_CLIENT_ERROR',
  USER_VOICE_VOLUME: 'rtc_core_USER_VOICE_VOLUME',
  USER_TIP_MESSAGE: 'rtc_core_USER_TIP_MESSAGE',
  USER_JOIN: 'rtc_core_USER_JOIN',
  USER_JOIN_EXTEND: 'rtc_core_USER_JOIN_EXTEND',
  USER_LEAVE: 'rtc_core_USER_LEAVE',
  USER_LEAVE_EXTEND: 'rtc_core_USER_LEAVE_EXTEND',
  USER_BANNED: 'rtc_core_USER_BANNED',
  STREAM_ADDED: 'rtc_core_STREAM_ADDED',
  STREAM_REMOVED: 'rtc_core_STREAM_REMOVED',
  STREAM_UPDATED: 'rtc_core_STREAM_UPDATED',
  STREAM_SUBSCRIBED: 'rtc_core_STREAM_SUBSCRIBED',
  STREAM_AUDIO_MUTE: 'rtc_core_STREAM_AUDIO_MUTE',
  STREAM_AUDIO_UNMUTE: 'rtc_core_STREAM_AUDIO_UNMUTE',
  STREAM_VIDEO_MUTE: 'rtc_core_STREAM_VIDEO_MUTE',
  STREAM_VIDEO_UNMUTE: 'rtc_core_STREAM_VIDEO_UNMUTE',
  SET_USER_INFO: 'rtc_core_SET_USER_INFO',
};

export const RtcDeviceServiceEvents = {
  NOT_FOUND_DEVICE_ERROR: 'rtc_device_service_NOT_FOUND_DEVICE_ERROR',
  CAMERA_MIC_USER_DENY: 'rtc_device_service_CAMERA_MIC_USER_DENY',
  DEVICE_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE: 'rtc_device_service_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE',
  DEVICE_CHANGE: 'rtc_device_service_CHAGE',
  DEVICE_CHANGE_ID: 'rtc_device_service_CHAGE_ID',
  DEVICE_CHANGE_VOICE_VOLUME: 'rtc_device_service_CHANGE_VOICE_VOLUME',
  DEVICE_CHANGE_MICROPHONE_VOLUME: 'rtc_device_service_CHANGE_MICROPHONE_VOLUME',
  DEVICE_ERROR: 'rtc_device_service_Error',
};
