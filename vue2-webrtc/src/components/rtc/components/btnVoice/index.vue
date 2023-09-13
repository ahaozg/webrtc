<template>
  <div class="btn-opera c-btn-icon c-btn-icon--vertical btn-voice"
       v-if="show"
       @click="onClickVoiceBtn">
    <div class="l-top">
      <svgIcon :icon-class="Number(voiceVolume) === 0 ? 'svg-voice-close' : 'svg-voice-open'"/>
      <span
        class="c-arrow"
        :class="{r180: visible}"
        @click.stop
        id="jsBtnVoiceArrow"></span>
      <cc-poptip
        link-id="jsBtnVoiceArrow"
        ref="refPoptip"
        class="rtc-poptip c-dropdown"
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
              :class="{active: device.deviceId === voice.deviceId}"
              v-for="device in voice.deviceList"
              :key="device.deviceId"
              @click="onClickDevice(device)">
              <singleText :text="device.label" />
            </li>
          </template>
        </ul>
      </cc-poptip>
    </div>
    <div class="l-bottom">扬声器</div>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import svgIcon from './../common/svg-icon';
import ccPoptip from './../common/poptip/index.vue';
import singleText from './../common/single-text';
import rtcCore from './../../rtcCore';
import {getVoiceVolume} from '../../utils/utils';
import {StorageKeys} from '../../constants/constant';
import emitter, {RtcDeviceServiceEvents} from '../../common/emitter/event';
import RtcDeviceVoice from '../../rtcCore/RtcDeviceVoice';

const defaultOldVoiceVolume = 50;

export default {
  name: 'btn-voice',
  mixins: [mixinStore],
  // components
  components: {
    svgIcon,
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
      name: 'btn-voice',
      visible: false,
      oldVoiceVolume: getVoiceVolume() || defaultOldVoiceVolume,
      voiceVolume: getVoiceVolume(),
      voice: new RtcDeviceVoice(),
    };
  },
  // computed
  computed: {
    tipText() {
      if (this.voice.deviceList.length === 0) {
        return '未检测到扬声器设备';
      }
      return '';
    },
  },
  // watch
  watch: {
    show(val) {
      if (!val) {
        this.$refs.refPoptip?.setVisibleFalse();
      }
    },
  },
  created() {
    // created
    emitter.on(RtcDeviceServiceEvents.DEVICE_CHANGE_VOICE_VOLUME, this.setVoiceVolume);
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
    emitter.off(RtcDeviceServiceEvents.DEVICE_CHANGE_VOICE_VOLUME, this.setVoiceVolume);
  },
  methods: {

    /**
     * 初始化方法
     * @return {void}
     */
    init() {
      this.voice = rtcCore.state.voice;
    },

    onClickVoiceBtn() {
      this.voiceVolume = Number(this.voiceVolume) === 0 ? this.oldVoiceVolume : 0;
      rtcCore.rtcDeviceService.setDevicePlayerVolume(this.voiceVolume);
      window.localStorage.setItem(StorageKeys.voiceVolume, String(this.voiceVolume));
      emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_VOICE_VOLUME, this.voiceVolume);
    },

    setVoiceVolume(volume) {
      const minOldVoiceVolume = 10;
      if (volume > minOldVoiceVolume) {
        this.oldVoiceVolume = volume;
      }
      this.voiceVolume = volume;
    },

    onClickDevice(device) {
      if (device) {
        const deviceId = device.deviceId;
        rtcCore.rtcDeviceService?.changeVoice(deviceId);
      }
      this.$refs.refPoptip?.setVisibleFalse();
    },
  },
};
</script>

<style lang="less">
.btn-voice {

}
</style>
