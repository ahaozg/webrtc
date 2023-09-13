<template>
  <div class="setting-voice">
    <cc-form-item class="item"
                  label="扬声器"
                  :label-width="labelWidth"
                  label-position="right">
      <div class="o-flex">
        <cc-select :list="voice.deviceList"
                   v-model="voice.deviceId"
                   list-key="deviceId"
                   @change="handleChange"
                   :no-data-text="noVoiceDevice? '当前浏览器不支持【扬声器】检测，请更换谷歌浏览器入会' : '未检测到设备'"
                   :placeholder="noVoiceDevice? '当前浏览器不支持【扬声器】检测，请更换谷歌浏览器入会' : ''"></cc-select>
        <div class="l-right">
          <audio ref="refAudioPlayer"
                 class="device-audio o-hide"
                 loop
                 :src="mp3"
                 controls></audio>
          <span class="c-btn c-btn-primary"
                :class="{disable: voice.deviceList.length === 0}"
                @click="clickVoiceBtn">{{voiceStatus ? '停止' : '检测扬声器'}}</span>
        </div>
      </div>
    </cc-form-item>
    <cc-form-item class="item"
                  label="音量"
                  :label-width="labelWidth"
                  label-position="right">
      <div class="o-flex">
        <cc-slider v-model="voiceVolume" :max="maxVolume" :show-tooltip="false" @input="changeVoiceVolume"></cc-slider>
        <span class="voice-num" v-text="`${voiceVolume}%`"></span>
      </div>
    </cc-form-item>
  </div>
</template>

<script>
import mixinsVoice from './../deviceDetection/mixins-voice';

export default {
  name: 'setting-voice',
  mixins: [mixinsVoice],
  data() {
    return {
      // name
      name: 'setting-voice',
    };
  },
};
</script>

<style lang="less">
.setting-voice {

}
</style>
