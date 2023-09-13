<template>
  <div class="rtc-device-camera">
    <div class="o-inner">
      <!--视频-->
      <cc-form-item class="device-form-item"
                    label="摄像头"
                    :label-width="labelWidth"
                    label-position="right">
        <cc-select :list="camera.deviceList"
                   v-model="camera.deviceId"
                   list-key="deviceId"
                   @change="handleChange"
                   :no-data-text="noDataText"></cc-select>
      </cc-form-item>
      <p class="device-result-text">您是否能看到自己的摄像头画面？</p>
      <div class="c-camera">
        <div class="c-camera--empty">
          <i class="rtc-icon-camera-plus-close" v-show="noDataText"></i>
          <span class="c-camera--emptyText" v-text="noDataText"></span>
        </div>
        <cc-inline-loading class="o-position-absolute" :loading="loading"/>
      </div>
      <!--清晰度-->
      <cc-form-item class="device-form-item"
                    v-if="showDefinition"
                    label="清晰度"
                    :label-width="labelWidth"
                    label-position="right">
        <cc-select :list="camera.definitionList"
                   v-model="camera.definitionId"
                   list-key="id"
                   disabledTitle="您的摄像头设备不支持该分辨率"
                   :disabled="camera.deviceList.length === 0"
                   :title="camera.deviceList.length === 0 ? '未检测到【摄像头】' : ''"
                   @change="handleDefinitionChange"
                   no-data-text="暂无数据"></cc-select>
      </cc-form-item>
      <cc-form-item class="device-form-item ept-mt-10"
                    v-if="showDefinition"
                    label=""
                    label-position="right"
                    label-width="120px">
        <p style="color: #777;">受系统性能占用、浏览器限制等因素的影响，实际清晰度不一定能够达到设定值，系统会自动调整匹配值。</p>
      </cc-form-item>
    </div>
    <div class="cc-dialog_footer" v-if="showFooterBtn">
      <span class="c-btn c-btn-default" @click="handleCancel">看不到</span>
      <span class="c-btn c-btn-primary" @click="handleConfirm">可以看到</span>
    </div>
  </div>
</template>

<script>
import rtcCore from '../../rtcCore/index';
import mixinsCamera from './mixins-camera';

export default {
  name: 'rtc-device-camera',
  mixins: [mixinsCamera],
  // props
  props: {
    showDefinition: {
      type: Boolean,
      default: false,
    },
    showFooterBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-device-camera',
    };
  },
  methods: {

    /**
     * 取消操作
     * @return {void}
     */
    handleCancel() {
      rtcCore.rtcDeviceService.setCameraTestingResult(false);
      this.$emit('cancel');
    },

    /**
     * 确认操作
     * @return {void}
     */
    handleConfirm() {
      rtcCore.rtcDeviceService.setCameraTestingResult(true);
      this.$emit('confirm');
    },
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-camera {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .o-inner {
    padding: @gapBig 100px 0;
  }
}
</style>
