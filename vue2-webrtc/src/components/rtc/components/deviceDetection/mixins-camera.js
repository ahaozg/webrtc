import ccInlineLoading from '../common/cc-inline-loading';
import ccFormItem from '../common/cc-form-item';
import ccSelect from '../common/select/select';
import RtcDeviceCamera from '../../rtcCore/RtcDeviceCamera';
import emitter, {RtcDeviceServiceEvents} from '../../common/emitter/event';
import rtcCore from '../../rtcCore';
import {StorageKeys} from '../../constants/constant';

export default {
  // components
  components: {ccInlineLoading, ccFormItem, ccSelect},
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
      camera: new RtcDeviceCamera(),
      noDataText: '',
      loading: true,
    };
  },
  // watch
  watch: {
    'camera.has'(has) {
      this.noDataText = has ? '' : '未检测到【摄像头】，请检查设备连接';
    },
  },
  created() {
    // created
    emitter.on(RtcDeviceServiceEvents.DEVICE_CHANGE, this.onDeviceChange);
  },
  mounted() {
    // mounted
    this.init();
  },
  beforeDestroy() {
    // beforeDestroy
    // 销毁流
    rtcCore.rtcDeviceService.releaseStream('cameraLocalStream');
    this.camera = this.$options.data().camera;
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
      this.camera = rtcCore.state.camera;
      this.$nextTick(() => {
        this.loading = true;
        const target = this.camera.definitionList.find(i => i.id === this.camera.definitionId);
        const encoderConfig = target.data;
        rtcCore.rtcDeviceService.startCameraTesting({encoderConfig})
          .finally(() => {
            this.setNoDataText();
            this.loading = false;
          });
      });
    },

    /**
     * 设置无数据的文本提示
     * @return {void}
     */
    setNoDataText() {
      let text = '';
      if (!this.camera.has) {
        text = '未检测到【摄像头】，请检查设备连接';
      } else if (this.camera.has && !(this.camera.connect && this.camera.hasAuth)) {
        text = '请允许浏览器及网页访问摄像头设备，并且没有其他应用占用摄像头设备';
      }
      this.noDataText = text;
    },

    /**
     * 下拉框改变
     * @param {string} deviceId deviceId
     * @return {void}
     */
    handleChange(deviceId) {
      this.noDataText = '';
      this.loading = true;
      rtcCore.rtcDeviceService.changeCamera(deviceId).then(() => {
        this.setNoDataText();
        this.loading = false;
      });
    },

    /**
     * 清晰度下拉框改变
     * @param {String} id id
     * @return {void}
     */
    handleDefinitionChange(id) {
      // fixme:index有问题
      console.log('id', id);
      window.localStorage.setItem(StorageKeys.definitionId, id);
      const target = this.camera.definitionList.find(i => i.id === id);
      const encoderConfig = target.data;
      rtcCore.rtcDeviceService.startCameraTesting({encoderConfig});
      // todo: 清晰度变化后的相关调用 修改全局事件
      // this.$bus.$emit('settingVideo-index-changedefinitionId', index);
    },
  },
};
