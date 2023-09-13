<template>
  <div class="rtc-device-microphone">
    <div v-if="showTime">
      <p class="device-result-desc">倒计时结束后开始录音</p>
      <p class="device-result-time">{{showTime}}s</p>
      <p class="device-result-desc ept-pt-0">注：录音用来检测您麦克风收音后别人听到的声音效果</p>
    </div>
    <template v-else>
      <div class="o-inner">
        <cc-form-item class="device-form-item"
                      label="麦克风"
                      v-show="micMediaRecorderIntervalTime"
                      :label-width="labelWidth"
                      label-position="right">
          <cc-select :list="microphone.deviceList"
                     v-model="microphone.deviceId"
                     list-key="deviceId"
                     @change="handleChange"
                     no-data-text="未检测到设备"></cc-select>
        </cc-form-item>
        <p class="device-result-desc"
           v-show="micMediaRecorderIntervalTime">对着麦克风说“测试麦克风”试试~</p>
        <div class="c-microphone-boxes"
             v-show="micMediaRecorderIntervalTime">
          <div class="c-microphone-item"
               :class="{active: item.status}"
               v-for="(item, index) in boxes"
               :key="index"></div>
        </div>
        <p class="device-result-text o-mt-gapBig"
           v-show="micMediaRecorderIntervalTime">正在录音({{micMediaRecorderIntervalTime}}s)</p>
        <audio class="device-microphone-audio"
               autoplay
               controls
               v-show="!(micMediaRecorderIntervalTime)"></audio>
        <p class="device-result-text"
           v-show="!(micMediaRecorderIntervalTime)">播放的声音是否清晰响亮无杂音？</p>
      </div>
      <div class="cc-dialog_footer" v-if="showFooterBtn">
        <span class="c-btn c-btn-default" @click="handleCancel">{{micMediaRecorderIntervalTime ? '看不到' : '声音不可以'}}</span>
        <span class="c-btn c-btn-primary" @click="handleConfirm">{{micMediaRecorderIntervalTime ? '看得到' : '声音可以'}}</span>
      </div>
    </template>
  </div>
</template>

<script>
import rtcCore from '../../rtcCore/index';
import mixinsMic from './mixins-mic';

export default {
  name: 'rtc-device-microphone',
  mixins: [mixinsMic],
  // props
  props: {
    showFooterBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-device-microphone',
    };
  },
  mounted() {
    // mounted
    this.init(true);
  },
  methods: {

    onDeviceChange() {
      this.init(true);
    },

    /**
     * 取消操作
     * @return {void}
     */
    handleCancel() {
      rtcCore.rtcDeviceService?.setMicrophoneTestingResult(false);
      this.$emit('cancel');
    },

    /**
     * 取消操作
     * @return {void}
     */
    handleConfirm() {
      rtcCore.rtcDeviceService?.setMicrophoneTestingResult(true);
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-microphone {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .device-result-text {
    padding: @gapBig 0;
    color: #ddd;
    text-align: center;
    line-height: 18px;
  }

  .device-result-desc {
    padding: @gapBig 0;
    color: #777;
    text-align: center;
    line-height: 18px;
  }

  .device-result-time {
    font-size: 61px;
    color: #FEFEFE;
    line-height: 81px;
    text-align: center;
  }

  .o-inner {
    padding: @gapBig 100px 0;
    text-align: center;
  }

  .device-microphone-audio {
    margin-top: 32px;
    margin-bottom: 96px;
  }
}
</style>
