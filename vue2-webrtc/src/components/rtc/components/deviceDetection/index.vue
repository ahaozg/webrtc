<template>
  <ccDialog
    class="rtc-device-popup"
    :visible.sync="visible"
    :transfer-dom="transferDom"
    @close="closePopup">
    <div class="cc-dialog_header">
      <div class="l-left o-ellipsis">设备检测</div>
      <div class="l-right" v-if="showCloseBtn">
        <div class="c-icon-wrap" @click="closePopup"><i class="rtc-icon-close"></i></div>
      </div>
    </div>
    <div class="cc-dialog_body">
      <!--公共头部icons-->
      <div class="cc-device-icons">
        <div class="o-item"
             :class="`status-${icon.status} device-icons-${icon.id} ${showStatus(icon)}`"
             v-for="icon in icons"
             :key="icon.id">
          <i :class="`rtc-icon-${icon.iconClass}`"></i>
        </div>
      </div>
      <!--摄像头检测-->
      <rtcDeviceCamera v-if="step === 'camera'"
                         @cancel="cameraOpera(false)"
                         @confirm="cameraOpera(true)" />
      <!--扬声器检测-->
      <rtcDeviceVoice v-if="step === 'voice'"
                         @cancel="voiceOpera(false)"
                         @confirm="voiceOpera(true)" />
      <!--麦克风检测-->
      <rtcDeviceMicrophone v-if="step === 'microphone'"
                             @cancel="microphoneOpera(false)"
                             @confirm="microphoneOpera(true)" />
      <!--网络检测-->
      <rtcDeviceNetwork v-if="step === 'network'"
                          @cancel="networkOpera(false)"
                          @confirm="networkOpera(true)" />
      <!--检测结果-->
      <rtcDeviceResult v-if="step === 'result'"
                         :icons="icons"
                         @cancel="resultOpera(false)"
                         @confirm="resultOpera(true)" />
    </div>
  </ccDialog>
</template>

<script>
import ccDialog from '../../components/common/dialog/index.vue';
import rtcDeviceCamera from './device-camera';
import rtcDeviceVoice from './device-voice';
import rtcDeviceMicrophone from './device-microphone';
import rtcDeviceNetwork from './device-network';
import rtcDeviceResult from './device-result';
import {deepCopy} from '../../utils/utils';

export default {
  name: 'rtc-device-popup',
  // components
  components: {ccDialog, rtcDeviceCamera, rtcDeviceVoice, rtcDeviceMicrophone, rtcDeviceNetwork, rtcDeviceResult},
  // props
  props: {
    // 默认是否展示
    visible: {
      type: Boolean,
      default: false,
    },
    // 弹窗放置哪个元素下面
    transferDom: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Boolean,
      default: 'body',
    },
    showCloseBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-device-popup',
      // 当前第几步
      step: '',
      // 计算下一步的函数
      nextStepFn: null,
      defaultIcons: [
        {
          id: 'camera',
          iconClass: 'camera',
          name: '摄像头',
          // 0/未知  1/成功  2/失败
          status: 0,
          statusName: '未知',
        },
        {
          id: 'voice',
          iconClass: 'voice',
          name: '扬声器',
          status: 0,
          statusName: '未知',
        },
        {
          id: 'microphone',
          iconClass: 'microphone-1',
          name: '麦克风',
          status: 0,
          statusName: '未知',
        },
        {
          id: 'network',
          name: '网络',
          iconClass: 'network',
          status: 0,
          statusName: '未知',
        },
        {
          id: 'result',
          iconClass: 'device-report',
          status: 0,
          statusName: '未知',
        },
      ],
      // icon图标
      icons: [],
    };
  },
  // computed
  computed: {},
  // watch
  watch: {
    // 监听visible
    visible: {
      handler(visible) {
        this.handlerVisible(visible);
      },
      immediate: true,
    },
  },
  created() {
    // created
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
  },
  methods: {

    handlerVisible(visible) {
      this.step = this.$options.data().step;
      this.nextStepFn = this.$options.data().nextStepFn;
      this.icons = this.$options.data().icons;
      if (visible) {
        this.resetConnect();
      }
    },

    // 重新连接
    resetConnect() {
      this.icons = deepCopy(this.defaultIcons);
      this.nextStepFn = this.stepGenerator();
      // 开始下一步
      this.stepNext();
    },

    // 判断是否展示当前图标的状态
    showStatus(icon) {
      const temp = {
        camera: ['camera'],
        voice: ['camera', 'voice'],
        microphone: ['camera', 'voice', 'microphone'],
        network: ['camera', 'voice', 'microphone', 'network'],
        result: ['camera', 'voice', 'microphone', 'network', 'result'],
      };
      const arr = temp[this.step];
      // 判断是否展示当前图标的状态
      return arr.includes(icon.id) ? 'show' : '';
    },

    // 设置icon
    setIcon(targetId, flag) {
      let result = flag;
      const nameObj = {
        0: '未知',
        1: '正常',
        2: '异常',
      };
      let resultName = nameObj[flag] || '未知';
      const targetIcon = this.icons.find(i => i.id === targetId);
      if (targetIcon) {
        const fail = 2;
        if (typeof flag === 'boolean') {
          result = flag ? 1 : fail;
          resultName = flag ? '正常' : '异常';
        }
        targetIcon.status = result;
        targetIcon.statusName = resultName;
      }
    },

    * stepGenerator() {
      const canIcons = this.icons;
      for (let i = 0; i < canIcons.length; i++) {
        yield canIcons[i].id;
      }
    },

    // 开始下一步
    stepNext() {
      const result = this.nextStepFn.next();
      if (result.done) {
        this.setResultIcon();
        return;
      }
      this.step = result.value;
    },

    // 摄像头操作
    cameraOpera(flag) {
      this.setIcon('camera', flag);
      // 开始下一步
      this.stepNext();
    },

    // 扬声器操作
    voiceOpera(flag) {
      this.setIcon('voice', flag);
      // 开始下一步
      this.stepNext();
    },

    // 麦克风操作
    microphoneOpera(flag) {
      this.setIcon('microphone', flag);
      // 开始下一步
      this.stepNext();
    },

    // 网络操作
    networkOpera(flag) {
      this.setIcon('network', flag);
      // 开始下一步
      this.stepNext();
    },

    // 设置结果icon
    setResultIcon() {
      // 设置结果
      const fail = 2;
      const hasFail = Boolean(this.icons.find(i => i.status === fail));
      this.setIcon('result', !hasFail);
    },

    // 结果操作
    resultOpera(flag) {
      if (flag) {
        this.closePopup();
      } else {
        // 重新检测
        this.resetConnect();
      }
    },

    // todo: 设备变化相关操作  需要再各个子组件中注册事件
    executeTesting() {
      this.$nextTick(() => {
        // if (this.step === 'network') {
        //   this.$refs.deviceNetwork && this.$refs.deviceNetwork.init();
        // }
        // if (this.step === 'camera') {
        //   this.$refs.deviceCamera && this.$refs.deviceCamera.init();
        // } else if (this.step === 'microphone') {
        //   this.$refs.deviceMicrophone && this.$refs.deviceMicrophone.init();
        // } else {
        //   const temp = {
        //     // camera: 'startCameraTesting',
        //     voice: 'startVoiceTesting',
        //     // microphone: 'startMicrophoneTesting',
        //     network: 'startNetworkTesting'
        //   };
        //   this.deviceDetection[temp[this.step]] && this.deviceDetection[temp[this.step]]().finally(() => {
        //     if (this.step === 'network') {
        //       this.$refs.deviceNetwork && this.$refs.deviceNetwork.finally();
        //     }
        //   });
        // }
      });
    },

    closePopup() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-popup {
  .cc-dialog_inner {
    width: 660px;
  }

  .cc-dialog_body {
    display: flex;
    flex-direction: column;
    height: 480px;
  }

  .cc-device-icons {
    flex: none;
    display: flex;
    justify-content: space-between;
    padding: 38px 30px 14px;
    font-size: 33px;

    &.noVoiceDevice .o-item::before {
      transform: translate(-90px, -50%);
    }

    .o-item {
      position: relative;

      & + .o-item::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-82px, -50%);
        width: 50px;
        height: 3px;
        background: rgba(216, 216, 216, .2);
        border-radius: 2px;
      }

      // 摄像头
      &.device-icons-camera.show,
      &.device-icons-voice.show,
      &.device-icons-microphone.show,
      &.device-icons-network.show,
      &.device-icons-result.show {
        &.status-1 {
          color: @colorSuccess;
        }

        &.status-2 {
          color: @colorError;
        }
      }
    }
  }

  .device-result-text {
    padding: @gapBig 0;
    color: #ddd;
    text-align: center;
    line-height: 18px;
  }
}
</style>
