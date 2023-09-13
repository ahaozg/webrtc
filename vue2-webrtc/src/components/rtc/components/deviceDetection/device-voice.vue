<template>
  <div class="rtc-device-voice">
    <div class="o-inner">
      <cc-form-item class="device-form-item"
                    label="扬声器"
                    :label-width="labelWidth"
                    label-position="right">
        <cc-select :list="voice.deviceList"
                   v-model="voice.deviceId"
                   list-key="deviceId"
                   @change="handleChange"
                   :no-data-text="noVoiceDevice? '当前浏览器不支持【扬声器】检测，请更换谷歌浏览器入会' : '未检测到设备'"
                   :placeholder="noVoiceDevice? '当前浏览器不支持【扬声器】检测，请更换谷歌浏览器入会' : ''"></cc-select>
      </cc-form-item>
      <div class="device-result-text">
        <p>请先确认您电脑的扬声器是开启状态</p>
        <p>请调高设备音量，点击播放测试扬声器</p>
      </div>
      <audio ref="refAudioPlayer"
             class="device-audio o-hide"
             loop
             :src="mp3"
             controls></audio>
      <i class="device-audio-btn"
         :class="voiceStatus ? 'rtc-icon-pause' : 'rtc-icon-play'"
         @click="clickVoiceBtn"></i>
      <cc-form-item class="device-form-item"
                    label="音量"
                    :label-width="labelWidth"
                    label-position="right">
        <cc-slider v-model="voiceVolume" :max="maxVolume" :show-tooltip="false" @input="changeVoiceVolume"></cc-slider>
        <span class="device-voice-num" v-text="`${voiceVolume}%`"></span>
      </cc-form-item>
    </div>
    <div class="cc-dialog_footer" v-if="showFooterBtn">
      <span class="c-btn c-btn-default" @click="handleCancel">听不到</span>
      <span class="c-btn c-btn-primary" @click="handleConfirm">可以听到</span>
    </div>
  </div>
</template>

<script>
import mixinsVoice from './mixins-voice';

export default {
  name: 'rtc-device-voice',
  mixins: [mixinsVoice],
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
      name: 'rtc-device-voice',
    };
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-voice {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .o-inner {
    padding: @gapBig 100px 0;
  }

  .device-audio-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px auto 22px;
    width: 56px;
    height: 56px;
    font-size: 20px;
    border-radius: 100%;
    background: #3F3F43;
    border: 1px solid #4B5056;
    color: #E6E6E7;
    text-align: center;
    cursor: pointer;

    &:hover {
      background: rgba(216, 216, 216, 0.1);
      border: 1px solid #4B5056;
    }
  }

  .device-voice-num {
    position: absolute;
    top: 50%;
    right: -50px;
    transform: translateY(-50%);
  }
}
</style>
