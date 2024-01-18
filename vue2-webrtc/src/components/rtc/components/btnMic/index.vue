<template>
  <div class="btn-opera c-btn-icon c-btn-icon--vertical btn-microphone"
       v-if="show && Object.keys(storeRoom.currentUser).length"
       id="jsBtnMicTip"
       @click="onClickMic">
    <div class="l-top">
      <ccMic :isMute="!storeRoom.currentUser.micOpen"
             :value="currentVolume" />
      <span
        class="c-arrow"
        :class="{r180: visible}"
        @click.stop
        id="jsBtnMicArrow"></span>
      <cc-poptip
        link-id="jsBtnMicArrow"
        ref="refPoptip"
        class="rtc-poptip rtc-poptip-second c-dropdown"
        transfer
        trigger="click"
        width="350px"
        placement="top"
        @change="visible = $event">
        <ul class="c-dropdown-inner">
          <li
            class="item"
            v-if="tipText"
            @click="onClickDevice(null)">
            <singleText :text="tipText" />
          </li>
          <template v-else>
            <li
              class="item"
              :class="{active: device.deviceId === microphone.deviceId}"
              v-for="device in microphone.deviceList"
              :key="device.deviceId"
              @click="onClickDevice(device)">
              <singleText :text="device.label" />
            </li>
          </template>
        </ul>
      </cc-poptip>
    </div>
    <div class="l-bottom">
      {{storeRoom.currentUser.micOpen ? '关闭语音' : '开启语音'}}
    </div>
    <cc-poptip
      link-id="jsBtnMicTip"
      ref="refPoptipAudioTip"
      class="rtc-poptip c-dropdown"
      transfer
      trigger=" "
      width="auto"
      placement="top"
      @change="visibleAudioTip = $event">
      <div
        class="c-blue-tip">
        {{audioText}}
        <span class="rtc-icon-close" @click="closeAudioTip"></span></div>
    </cc-poptip>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import ccMic from './../common/cc-mic';
import ccPoptip from './../common/poptip/index.vue';
import singleText from './../common/single-text';
import rtcCore from './../../rtcCore';
import RtcDeviceMic from '../../rtcCore/RtcDeviceMic';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../../constants/constant';
import emitter, {RtcCoreEvents} from '../../common/emitter/event';

const minVolume = 0.3;

export default {
  name: 'btn-microphone',
  mixins: [mixinStore],
  // components
  components: {
    ccMic,
    ccPoptip,
    singleText,
  },
  // props
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'btn-microphone',
      visible: false,
      microphone: new RtcDeviceMic(),
      visibleAudioTip: this.show,
      audioText: '发言请打开我~~',
      // 提示定时器
      audioTipTimer: null,
      // 提示时间  提示框最少存在3s  一直说话 则一直存在
      audioTipTime: 3000,
      // 两个提示框之间最少存在20s的时间间隔
      tipIntervalTime: 20000,
      tipIntervalTimer: null,
    };
  },
  // computed
  computed: {
    tipText() {
      if (this.microphone.errorText) {
        return this.microphone.errorText;
      }
      if (this.microphone.deviceList.length === 0) {
        return '未检测到麦克风设备';
      }
      return '';
    },
    currentVolume() {
      return this.storeRoom.currentUser.micLevel;
    },
  },
  // watch
  watch: {
    currentVolume(volume) {
      if (this.storeRoom.currentUser.micOpen) {
        return;
      }
      const val = volume > minVolume ? '您当前处于静音状态，如需发言请打开麦克风' : '';
      if (val) {
        this.audioText = val;
        // 不在间隔时间内，并且弹窗不再展示的3s内，才可以提示
        if (!this.tipIntervalTimer && !this.audioTipTimer) {
          // 展示弹窗
          this.visibleAudioTip = true;
          // 重新开始定时器
          this.startTimer();
        }
      }
    },
    localAudioOpen(val) {
      if (val) {
        this.visibleAudioTip = false;
      }
    },
    visibleAudioTip(val) {
      if (val) {
        this.$refs.refPoptipAudioTip?.setVisibleTrue();
      } else {
        this.$refs.refPoptipAudioTip?.setVisibleFalse();
      }
    },
    show(val) {
      if (!val) {
        this.$refs.refPoptip?.setVisibleFalse();
        this.closeAudioTip();
      }
    },
  },
  created() {
    // created
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
  },
  methods: {

    /**
     * 初始化方法
     * @return {void}
     */
    init() {
      this.microphone = rtcCore.state.microphone;
      if (this.visibleAudioTip) {
        this.$nextTick(() => {
          this.$refs.refPoptipAudioTip?.setVisibleTrue();
        });
      }
    },

    async onClickDevice(device) {
      if (device && device.deviceId !== this.microphone.deviceId) {
        const deviceId = device.deviceId;
        await rtcCore.rtcDeviceService?.changeMicrophone(deviceId, false);
        // todo: 待蓝牙验证
        rtcCore.rtcCloudService?.switchMic(deviceId);
      }
      this.$refs.refPoptip?.setVisibleFalse();
    },

    // 关闭本地发言提示
    closeAudioTip() {
      this.visibleAudioTip = false;
      this.stopTimer();
      this.startIntervalTimer();
    },

    // 开始定时器
    startTimer() {
      this.stopTimer();
      this.audioTipTimer = window.setTimeout(() => {
        this.visibleAudioTip = false;
        this.startIntervalTimer();
        this.stopTimer();
      }, this.audioTipTime);
    },

    // 结束定时器
    stopTimer() {
      window.clearTimeout(this.audioTipTimer);
      this.audioTipTimer = null;
    },

    // 开始间隔定时器
    startIntervalTimer() {
      this.stopIntervalTimer();
      this.tipIntervalTimer = window.setTimeout(() => {
        this.stopIntervalTimer();
      }, this.tipIntervalTime);
    },

    // 结束间隔定时器
    stopIntervalTimer() {
      window.clearTimeout(this.tipIntervalTimer);
      this.tipIntervalTimer = null;
    },

    async onClickMic() {
      this.visibleAudioTip = false;
      const hasMicAudio = rtcCore.hasLocalStreamAudio();
      if (hasMicAudio) {
        const result = rtcCore.setLocalStreamMute({
          tag: StreamTag.MIC,
          mute: this.storeRoom.currentUser?.micOpen,
        });
        if (result) {
          emitter.emit(RtcCoreEvents.SET_USER_INFO, {
            userId: this.storeRoom.roomInfo.userId,
            micOpen: !this.storeRoom.currentUser?.micOpen,
          });
          if (this.storeRoom.currentUser?.micOpen) {
            rtcCore.rtcCloudService.setMicInterval();
          } else {
            rtcCore.rtcCloudService.clearMicInterval();
          }
        }
      } else {
        await rtcCore.publishMicStream({
          userId: this.storeRoom.roomInfo.userId,
          mute: this.storeRoom.currentUser?.micOpen,
          microphoneId: rtcCore.state.microphone.deviceId,
          successCb: () => {
            emitter.emit(RtcCoreEvents.SET_USER_INFO, {
              userId: this.storeRoom.roomInfo.userId,
              micOpen: !this.storeRoom.currentUser?.micOpen,
            });
          },
          errorCb: (e) => {
            if (e.code === RoomErrorCode.LOCAL_STREAM_PUBLISHING) {
              emitter.emit(RtcCoreEvents.USER_TIP_MESSAGE, {
                code: RoomErrorCode.LOCAL_STREAM_PUBLISHING,
                message: RoomErrorMessage.LOCAL_STREAM_PUBLISHING,
              });
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="less">
.btn-microphone {

}
</style>
