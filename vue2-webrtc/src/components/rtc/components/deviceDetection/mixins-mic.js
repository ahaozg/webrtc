import ccFormItem from '../common/cc-form-item';
import ccSelect from '../common/select/select';
import ccSlider from '../common/slider/slider';
import RtcDeviceMic from '../../rtcCore/RtcDeviceMic';
import {getMicrophoneVolume, throttle} from '../../utils/utils';
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
      // name
      microphone: new RtcDeviceMic(),
      // 倒计时
      showTime: 3,
      showTimer: null,
      timer: null,
      time: 100,
      boxes: [],
      // 麦克风状态
      microphoneStatus: false,
      micMediaRecorderTime: 6,
      maxVolume: 100,
      microphoneVolume: getMicrophoneVolume(),
    };
  },
  // computed
  computed: {
    // 录制时间
    micMediaRecorderIntervalTime() {
      const time = this.micMediaRecorderTime > 0 ? this.micMediaRecorderTime - 1 : 0;
      if (time === 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.microphoneStatus = false;
      }
      return time;
    },
    // 操作按钮相关
    operaBtnText() {
      if (!this.microphoneStatus) {
        return '检测麦克风';
      }
      if (this.micMediaRecorderIntervalTime) {
        return `录音中(${this.micMediaRecorderIntervalTime}s)`;
      }
      return '检测麦克风';
    },
    operaBtnDisabled() {
      if (this.microphone.deviceList.length === 0) {
        return true;
      }
      return Boolean(this.microphoneStatus && this.micMediaRecorderIntervalTime);
    },
  },
  created() {
    // created
    emitter.on(RtcDeviceServiceEvents.DEVICE_CHANGE, this.onDeviceChange);
    emitter.on(RtcDeviceServiceEvents.DEVICE_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE, this.micRecordTimeChange);
  },
  beforeDestroy() {
    // beforeDestroy
    window.clearInterval(this.showTimer);
    this.stopBoxBounce();
    // 销毁流
    rtcCore.rtcDeviceService?.releaseStream('microphoneLocalStream');
    this.microphone = this.$options.data().microphone;
    emitter.off(RtcDeviceServiceEvents.DEVICE_CHANGE, this.onDeviceChange);
    emitter.off(RtcDeviceServiceEvents.DEVICE_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE, this.micRecordTimeChange);
  },
  methods: {

    init(immediate) {
      this.micMediaRecorderTime = rtcCore.rtcDeviceService.micMediaRecorderIntervalTime;
      this.microphone = rtcCore.state.microphone;
      this.showTime = this.$options.data().showTime;
      this.initBox();
      if (immediate) {
        this.start();
      }
    },

    start() {
      // 销毁流
      rtcCore.rtcDeviceService?.releaseStream('microphoneLocalStream');
      window.clearInterval(this.showTimer);
      this.showTimer = window.setInterval(() => {
        this.showTime -= 1;
        if (this.showTime === 0) {
          window.clearInterval(this.showTimer);
          // 开始检测
          rtcCore.rtcDeviceService?.startMicrophoneTesting().then(() => {
            this.$nextTick(() => {
              this.startBoxBounce();
            });
          });
        }
        // eslint-disable-next-line no-magic-numbers
      }, 1000);
    },

    micRecordTimeChange(t) {
      this.micMediaRecorderTime = t;
    },

    // 初始化盒子
    initBox() {
      this.boxes = [];
      let i = 24;
      while (i >= 0) {
        this.boxes.push({
          // 状态
          status: false,
        });
        i--;
      }
    },

    // 使盒子跳动起来
    startBoxBounce() {
      this.stopBoxBounce();
      this.timer = window.setInterval(() => {
        const length = this.boxes.length;
        this.boxes.forEach(box => {
          box.status = false;
        });
        const volume = this.microphone.volume;
        // 转换一下
        let result = 0;
        const coefficient = 0.5;
        const proportion = 0.8;
        if (volume >= coefficient) {
          result = proportion + (volume - coefficient) * (1 - proportion) / coefficient;
        } else {
          result = volume * proportion / coefficient;
        }
        const num = Math.ceil(length * result);
        for (let z = 0; z < num; z++) {
          this.boxes[z].status = true;
        }
      }, this.time);
    },

    // 停止跳动
    stopBoxBounce() {
      window.clearInterval(this.timer);
      this.timer = null;
      this.boxes.forEach(box => {
        box.status = false;
      });
    },

    // 下拉框改变
    handleChange(deviceId) {
      rtcCore.rtcDeviceService?.changeMicrophone(deviceId);
    },

    // 点击麦克风按钮
    clickMicrophoneBtn() {
      if (this.operaBtnDisabled) {
        return;
      }
      this.microphoneStatus = !this.microphoneStatus;
      // 销毁流
      rtcCore.rtcDeviceService?.releaseStream('microphoneLocalStream');
      this.stopBoxBounce();
      if (this.microphoneStatus) {
        // 开始检测
        rtcCore.rtcDeviceService?.startMicrophoneTesting().then(() => {
          this.$nextTick(() => {
            this.startBoxBounce();
          });
        });
      }
    },

    changeMicrophoneVolume: throttle(function () {
      /* eslint-disable */
      this.rtcDeviceService?.setMicrophoneStreamVolume(this.microphoneVolume);
      window.localStorage.setItem(StorageKeys.microphoneVolume, String(this.microphoneVolume));
      emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_MICROPHONE_VOLUME, this.microphoneVolume);
      /* eslint-enable */
      // eslint-disable-next-line
    }, 300),
  },
};
