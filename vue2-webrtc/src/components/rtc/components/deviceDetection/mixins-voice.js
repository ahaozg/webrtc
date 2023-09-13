import ccFormItem from '../common/cc-form-item';
import ccSelect from '../common/select/select';
import ccSlider from '../common/slider/slider';
import RtcDeviceVoice from '../../rtcCore/RtcDeviceVoice';
import {getVoiceVolume, throttle} from '../../utils/utils';
import mp3 from '../../assets/media/2022-03-24 21-43-32.mp3';
import emitter, {RtcDeviceServiceEvents} from '../../common/emitter/event';
import rtcCore from '../../rtcCore';
import {StorageKeys} from '../../constants/constant';

export default {
  // components
  components: {ccFormItem, ccSelect, ccSlider},
  // props
  props: {
    labelWidth: {
      type: String,
      default: '60px',
    },
  },
  data() {
    return {
      voice: new RtcDeviceVoice(),
      noVoiceDevice: false,
      maxVolume: 100,
      // 扬声器状态
      voiceStatus: false,
      voiceVolume: getVoiceVolume(),
      mp3,
    };
  },
  created() {
    // created
    emitter.on(RtcDeviceServiceEvents.DEVICE_CHANGE, this.onDeviceChange);
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
    this.voiceStatus = false;
    this.setAudioPlay(false);
    this.voice = this.$options.data().voice;
    emitter.off(RtcDeviceServiceEvents.DEVICE_CHANGE, this.onDeviceChange);
  },
  methods: {

    onDeviceChange() {
      this.init();
    },

    /**
     * 初始化方法
     * @return {void}
     */
    init() {
      this.noVoiceDevice = rtcCore.rtcDeviceService.noVoiceDevice;
      this.voice = rtcCore.state.voice;
      rtcCore.rtcDeviceService.startVoiceTesting();
    },

    /**
     * 下拉框改变
     * @param {string} deviceId deviceId
     * @return {void}
     */
    handleChange(deviceId) {
      rtcCore.rtcDeviceService.changeVoice(deviceId);
      const audioPlayer = this.$refs.refAudioPlayer;
      if (audioPlayer && audioPlayer.setSinkId) {
        audioPlayer.setSinkId(deviceId);
      }
    },

    /**
     * 点击播放按钮
     * @return {void}
     */
    clickVoiceBtn() {
      this.voiceStatus = !this.voiceStatus;
      if (this.voiceStatus) {
        this.$nextTick(() => {
          this.setAudioPlay(true);
        });
      } else {
        this.setAudioPlay(false);
      }
    },

    /**
     * 设置audio音量
     * @param {Boolean} flag 播放
     * @return {void}
     */
    setAudioPlay(flag) {
      const audioPlayer = this.$refs.refAudioPlayer;
      if (audioPlayer) {
        if (flag) {
          // 播放
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      }
    },


    /**
     * 设置audio音量
     * @param {number} volume 0-100
     * @return {void}
     */
    setAudioVolume(volume) {
      const audioPlayer = this.$refs.refAudioPlayer;
      if (audioPlayer) {
        const percent = 100;
        audioPlayer.volume = volume / percent;
      }
    },

    /**
     * 扬声器音量变化
     * @return {void}
     */
    changeVoiceVolume: throttle(function () {
      /* eslint-disable */
      this.setAudioVolume(this.voiceVolume);
      rtcCore.rtcDeviceService.setDevicePlayerVolume(this.voiceVolume);
      window.localStorage.setItem(StorageKeys.voiceVolume, String(this.voiceVolume));
      emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_VOICE_VOLUME, this.voiceVolume);
      // eslint-disable-next-line
    }, 300),

    /**
     * 取消操作
     * @return {void}
     */
    handleCancel() {
      rtcCore.rtcDeviceService.setVoiceTestingResult(false);
      this.setAudioPlay(false);
      this.$emit('cancel');
    },

    /**
     * 取消操作
     * @return {void}
     */
    handleConfirm() {
      rtcCore.rtcDeviceService.setVoiceTestingResult(true);
      this.setAudioPlay(false);
      this.$emit('confirm');
    }
  },
}
