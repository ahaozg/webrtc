<template>
  <div class="setting-camera">
    <cc-form-item class="item"
                  label="摄像头"
                  :label-width="labelWidth"
                  label-position="right">
      <cc-select :list="camera.deviceList"
                 v-model="camera.deviceId"
                 list-key="deviceId"
                 @change="handleChange"
                 :no-data-text="noDataText"></cc-select>
    </cc-form-item>
    <cc-form-item class="item"
                  label=""
                  :label-width="labelWidth"
                  label-position="right">
      <div class="c-camera">
        <div class="c-camera--empty">
          <i class="rtc-icon-camera-plus-close" v-show="noDataText"></i>
          <span class="c-camera--emptyText" v-text="noDataText"></span>
        </div>
        <cc-inline-loading class="o-position-absolute" :loading="loading"/>
      </div>
    </cc-form-item>
    <cc-form-item class="item"
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
    <cc-form-item class="item"
                  label=""
                  label-position="right"
                  :label-width="labelWidth">
      <p style="color: #777;">受系统性能占用、浏览器限制等因素的影响，实际清晰度不一定能够达到设定值，系统会自动调整匹配值。</p>
    </cc-form-item>
  </div>
</template>

<script>
import mixinsCamera from './../deviceDetection/mixins-camera';

export default {
  name: 'setting-camera',
  mixins: [mixinsCamera],
  data() {
    return {
      // name
      name: 'setting-camera',
    };
  },
};
</script>

<style lang="less">
.setting-camera {
  .c-camera {
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.25);
  }
}
</style>
