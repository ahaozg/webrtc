<template>
  <div class="setting-microphone">
    <cc-form-item class="item"
                  label="麦克风"
                  :label-width="labelWidth"
                  label-position="right">
      <div class="o-flex">
        <cc-select :list="microphone.deviceList"
                   v-model="microphone.deviceId"
                   list-key="deviceId"
                   @change="handleChange"
                   no-data-text="未检测到设备"></cc-select>
        <div class="l-right">
          <span class="c-btn c-btn-primary"
                :class="{disable: operaBtnDisabled}"
                @click="clickMicrophoneBtn">{{operaBtnText}}</span>
        </div>
      </div>
    </cc-form-item>
    <cc-form-item class="item"
                  label="音量"
                  :label-width="labelWidth"
                  label-position="right">
      <div class="o-flex">
        <cc-slider v-model="microphoneVolume" :max="maxVolume" :show-tooltip="false" @input="changeMicrophoneVolume"></cc-slider>
        <span class="voice-num" v-text="`${microphoneVolume}%`"></span>
      </div>
    </cc-form-item>
    <cc-form-item class="item"
                  label=""
                  :label-width="labelWidth"
                  label-position="right">
      <div class="o-flex">
        <audio class="device-microphone-audio"
               autoplay
               controls
               v-show="!(micMediaRecorderIntervalTime)"></audio>
        <div class="c-microphone-boxes"
             v-show="micMediaRecorderIntervalTime">
          <div class="c-microphone-item"
               :class="{active: item.status}"
               v-for="(item, index) in boxes"
               :key="index"></div>
        </div>
        <span class="voice-num"></span>
      </div>
    </cc-form-item>
  </div>
</template>

<script>
import mixinsMic from './../deviceDetection/mixins-mic';

export default {
  name: 'setting-microphone',
  mixins: [mixinsMic],
  data() {
    return {
      // name
      name: 'setting-microphone',
    };
  },
  mounted() {
    // mounted
    this.init();
  },
  methods: {

    onDeviceChange() {
      this.init();
    },
  },
};
</script>

<style lang="less">
.setting-microphone {

}
</style>
