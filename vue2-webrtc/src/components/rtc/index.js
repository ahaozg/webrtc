import './assets/fonts/style.css';

import mixinStore from './store/mixinStore';

import rtcCore from './rtcCore/index';

import emitter, {UIEvents, RtcCoreEvents, RtcDeviceServiceEvents} from './common/emitter/event';
import logger from './common/logger/index';
import roomError from './common/room/error';
import {RoomErrorCode, RoomErrorMessage} from './constants/constant';

import svgAudioClose from './components/common/svg-audio-close';
import svgAudioOpen from './components/common/svg-audio-open';
import svgVideoClose from './components/common/svg-video-close';
import svgVideoOpen from './components/common/svg-video-open';
import svgVoiceClose from './components/common/svg-voice-close';
import svgVoiceOpen from './components/common/svg-voice-open';
import {throttle} from './utils/utils';
import calcGrid1 from './utils/calcGrid1';

const logPrefix = '[Room]';

const rtcHeader = () => import('./components/rtcHeader');
const rtcContent = () => import('./components/rtcContent');
const rtcFooter = () => import('./components/rtcFooter');
const rtcDevicePopup = () => import('./components/deviceDetection');
const rtcFullScreenTip = () => import('./components/rtcFullScreenTip');
const rtcSetting = () => import('./components/setting');

export default {
  name: 'cc-rtc',
  mixins: [mixinStore],
  // components
  components: {
    svgAudioClose,
    svgAudioOpen,
    svgVideoClose,
    svgVideoOpen,
    svgVoiceClose,
    svgVoiceOpen,
    rtcHeader,
    rtcContent,
    rtcFooter,
    rtcDevicePopup,
    rtcFullScreenTip,
    rtcSetting,
  },
  // props
  props: {
    // 弹窗放置哪个元素下面
    transferDom: {
      type: String | Boolean,
      default: '#jsRtc',
    },
    // 进入房间用户信息扩展
    extendJoinUserFn: {
      type: Function,
      default: function ({user, users}) {
        calcGrid1(users, this.mainRect);
        return user;
      },
    },
    // 离开房间用户信息扩展
    extendLeaveUserFn: {
      type: Function,
      default: function ({users}) {
        calcGrid1(users, this.mainRect);
      },
    },
  },
  data() {
    return {
      // name
      name: 'cc-rtc',
      coreReady: false,
      enterRoomSuccess: false,
      devicePopupVisible: false,
      settingPopupVisible: false,
      mainRect: {},
    };
  },
  // computed
  computed: {},
  // watch
  watch: {},
  created() {
    // created
    emitter.on(UIEvents.ERROR, this.emitError);
    emitter.on(UIEvents.SDK_ERROR, this.emitSDKError);
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
    this.destroyRoom();
  },
  methods: {

    /**
     * 初始化方法
     * @return {void}
     */
    async init() {
      logger.log(`${logPrefix}.init rtcCore`, rtcCore);
      // 系统 浏览器 是否支持
      const checkResult = await rtcCore.checkSystemRequirements();
      this.storeDevice.setIsBrowserSupported(checkResult.result);
      if (!checkResult.result) {
        const errData = {
          code: RoomErrorCode.CHECK_SYSTEM_REQUIREMENTS,
          message: RoomErrorMessage.CHECK_SYSTEM_REQUIREMENTS,
          data: checkResult,
        };
        this.emitError(errData);
        return;
      }
      this.bindRTCEvents();
      this.bindWindowEvent();
      // 音视频设备检查 授权
      const deviceError = await this.startDevice();
      this.coreReady = true;
      this.$nextTick(() => {
        this.$emit('ready', deviceError);
      });
    },

    async startDevice() {
      // 弹窗优化，展示初始化的提示  体验优化
      const time = 2000;
      const timer = window.setTimeout(() => {
        window.clearTimeout(timer);
        if (this.storeDevice.hasDeviceAuth === -1) {
          this.storeDevice.setHasDeviceAuth(0);
        }
      }, time);
      const deviceError = await rtcCore.rtcDeviceService.init();
      if (deviceError) {
        // eslint-disable-next-line no-magic-numbers
        this.storeDevice.setHasDeviceAuth(2);
        return deviceError;
      }
      this.storeDevice.setHasDeviceAuth(1);
    },

    bindRTCEvents() {
      if (rtcCore) {
        rtcCore.on(RtcCoreEvents.CLIENT_ERROR, this.handleRtcError);
        rtcCore.on(RtcCoreEvents.USER_VOICE_VOLUME, this.userVoiceVolume);
        rtcCore.on(RtcCoreEvents.USER_TIP_MESSAGE, this.userTipMessage);
        rtcCore.on(RtcCoreEvents.USER_JOIN_EXTEND, this.userJoinExtend);
        rtcCore.on(RtcCoreEvents.USER_LEAVE_EXTEND, this.userLeaveExtend);
        rtcCore.on(RtcDeviceServiceEvents.NOT_FOUND_DEVICE_ERROR, this.notFoundDeviceError);
        rtcCore.on(RtcDeviceServiceEvents.CAMERA_MIC_USER_DENY, this.cameraMicUserDeny);
        rtcCore.on(RtcDeviceServiceEvents.DEVICE_CHANGE, this.emitDeviceChange);
        rtcCore.on(RtcDeviceServiceEvents.DEVICE_CHANGE_ID, this.emitDeviceIdChange);
        rtcCore.on(UIEvents.CHANGE_USER_ARRAY, this.handleUsers);
      }
    },

    unbindRTCEvents() {
      if (rtcCore) {
        rtcCore.off(RtcCoreEvents.CLIENT_ERROR, this.handleRtcError);
        rtcCore.off(RtcCoreEvents.USER_VOICE_VOLUME, this.userVoiceVolume);
        rtcCore.off(RtcCoreEvents.USER_TIP_MESSAGE, this.userTipMessage);
        rtcCore.off(RtcCoreEvents.USER_JOIN_EXTEND, this.userJoinExtend);
        rtcCore.off(RtcCoreEvents.USER_LEAVE_EXTEND, this.userLeaveExtend);
        rtcCore.off(RtcDeviceServiceEvents.NOT_FOUND_DEVICE_ERROR, this.notFoundDeviceError);
        rtcCore.off(RtcDeviceServiceEvents.CAMERA_MIC_USER_DENY, this.cameraMicUserDeny);
        rtcCore.off(RtcDeviceServiceEvents.DEVICE_CHANGE, this.emitDeviceChange);
        rtcCore.off(RtcDeviceServiceEvents.DEVICE_CHANGE_ID, this.emitDeviceIdChange);
        rtcCore.off(UIEvents.CHANGE_USER_ARRAY, this.handleUsers);
      }
    },

    // 绑定事件
    bindWindowEvent() {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    },
    // 解绑事件
    unbindWindowEvent() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },

    userVoiceVolume() {
      //
    },

    notFoundDeviceError() {
      //
    },

    cameraMicUserDeny(data) {
      //
      logger.log(`${logPrefix}.cameraMicUserDeny`, data);
    },

    /**
     * 加入房间
     * @param {object} options - 加入房间参数
     * @return {Promise} 只有resolve的promise
     */
    enterRoom(options) {
      return new Promise((resolve) => {
        const defaultOptions = {
          mode: 'rtc',
          sdkAppId: '',
          userSig: '',
          roomId: '',
          userId: '',
          roomName: '',
          enableMic: false,
          enableCamera: false,
          enableScreenShare: false,
          useStringRoomId: true,
          autoSubscribe: false,
          enableAutoPlayDialog: false,
        };
        const resultOptions = Object.assign(defaultOptions, options);
        resultOptions.roomId = String(resultOptions.roomId);
        if (!resultOptions.sdkAppId || !resultOptions.userSig || !resultOptions.roomId || !resultOptions.userId) {
          this.emitError({
            code: RoomErrorCode.CREATE_ROOM_PARAM_ERROR,
            message: `${RoomErrorMessage.CREATE_ROOM_PARAM_ERROR}，请检查sdkAppId(Number)、userSig、roomId(String)、userId这四项属性是否有值, 格式是否正确，`,
          });
          resolve({
            code: RoomErrorCode.CREATE_ROOM_PARAM_ERROR,
            message: `${RoomErrorMessage.CREATE_ROOM_PARAM_ERROR}，请检查sdkAppId(Number)、userSig、roomId(String)、userId这四项属性是否有值`,
          });
          return;
        }
        logger.debug(`${logPrefix}.enterRoom resultOptions：`, resultOptions);
        this.storeRoom.setRoomInfo(resultOptions);
        // 加入房间
        rtcCore.joinRoom(resultOptions).then(() => {
          logger.log(`${logPrefix}.enterRoom success`);
          this.enterRoomSuccess = true;
          resolve();
        })
          .catch(err => {
            this.enterRoomSuccess = false;
            logger.error(`${logPrefix}.enterRoom rtcCore joinRoom`, err);
            this.emitError({
              code: RoomErrorCode.CREATE_ROOM_ERROR,
              message: RoomErrorMessage.CREATE_ROOM_ERROR,
              data: err,
            });
            resolve({
              code: RoomErrorCode.CREATE_ROOM_ERROR,
              message: RoomErrorMessage.CREATE_ROOM_ERROR,
              data: err,
            });
          })
          .finally(() => {
            this.$nextTick(() => {
              this.handleResize();
            });
          });
      });
    },

    /**
     * 退出房间
     * @return {Promise} 只有resolve的promise
     */
    exitRoom() {
      return new Promise((resolve) => {
        rtcCore.exitRoom().then(() => {
          resolve();
        })
          .catch(e => {
            this.emitError({
              code: RoomErrorCode.EXIT_ROOM_ERROR,
              message: RoomErrorMessage.EXIT_ROOM_ERROR,
              data: e,
            });
            resolve({
              code: RoomErrorCode.EXIT_ROOM_ERROR,
              message: RoomErrorMessage.EXIT_ROOM_ERROR,
              data: e,
            });
          });
      });
    },

    /**
     * 销毁房间
     * @return {void}
     */
    destroyRoom() {
      this.unbindRTCEvents();
      this.unbindWindowEvent();
      emitter.off(UIEvents.ERROR, this.emitError);
      emitter.off(UIEvents.SDK_ERROR, this.emitSDKError);
      this.coreReady = false;
      rtcCore.destroy();
    },

    /**
     * 发送error事件
     * @param {string | number} code - code
     * @param {string} message - message
     * @param {null} data - data
     * @return {void}
     */
    emitError({
      code = 0,
      message = '',
      data = null,
    }) {
      logger.error(`${logPrefix}.emitError --> code：${code}  message：${code} data：`, data);
      this.$emit(UIEvents.ERROR, roomError.error(code, message, data));
    },

    /**
     * 发送SDK error事件
     * @param {string | number} code - code
     * @param {string} message - message
     * @param {null} data - data
     * @return {void}
     */
    emitSDKError({
      code = 0,
      message = '',
      data = null,
    }) {
      this.$emit(UIEvents.SDK_ERROR, roomError.error(code, message, data));
    },

    emitDeviceChange(deviceData) {
      this.$emit(UIEvents.CHANGE_DEVICE, deviceData);
    },

    emitDeviceIdChange({deviceType, device}) {
      this.$emit(UIEvents.CHANGE_DEVICE_ID, deviceType, device);
    },

    userTipMessage({type, message}) {
      this.$emit(UIEvents.USER_TIP_MESSAGE, type, message);
    },

    clickDeviceBtn() {
      this.devicePopupVisible = true;
    },

    clickSettingBtn() {
      this.settingPopupVisible = true;
    },

    handleBeforeUnload() {
      this.exitRoom();
    },

    handleResize: throttle(function () {
      emitter.emit(UIEvents.WINDOW_RESIZE);
      // eslint-disable-next-line no-magic-numbers
    }, 300),

    async userJoinExtend({user, users}) {
      let target = null;
      try {
        target = await this.extendJoinUserFn({user, users});
      } catch (e) {
        this.emitError({
          code: RoomErrorCode.USER_JOIN_EXTEND_ERROR,
          message: RoomErrorMessage.USER_JOIN_EXTEND_ERROR,
          data: e,
        });
      }
      target && rtcCore.setStateUsers(target);
    },

    async userLeaveExtend({user, users}) {
      try {
        this.extendLeaveUserFn({user, users});
      } catch (e) {
        this.emitError({
          code: RoomErrorCode.USER_LEAVE_EXTEND_ERROR,
          message: RoomErrorMessage.USER_LEAVE_EXTEND_ERROR,
          data: e,
        });
      }
    },

    handleUsers({data}) {
      this.storeRoom.setUsers(data);
    },

    setMainRect(rect) {
      this.mainRect = rect;
      this.$emit('mainRectChange', {
        rect,
        users: this.storeRoom.users,
      });
    },

    handleRtcError(e) {
      this.emit({
        code: RoomErrorCode.RTC_CLIENT_ERROR,
        message: RoomErrorMessage.RTC_CLIENT_ERROR,
        data: e,
      });
    },
  },
};
