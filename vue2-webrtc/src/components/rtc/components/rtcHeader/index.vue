<template>
  <header class="rtc-header">
    <div class="l-left o-ellipsis"
         :title="storeRoom.roomInfo.roomName"
         v-text="storeRoom.roomInfo.roomName"></div>
    <ul class="l-right">
      <li class="o-item"
          v-if="coreReady && showDeviceDetectionBtn"
          @click="clickDeviceBtn">
        <div class="c-icon-wrap"><i class="rtc-icon-device-detection"></i>设备检测</div>
      </li>
      <li class="o-item"
          v-if="coreReady && showSettingBtn"
          @click="clickSettingBtn">
        <div class="c-icon-wrap"><i class="rtc-icon-setting"></i>设置</div>
      </li>
    </ul>
  </header>
</template>

<script>

import mixinStore from '../../store/mixinStore';

export default {
  name: 'rtc-header',
  mixins: [mixinStore],
  // components
  components: {},
  // props
  props: {
    coreReady: Boolean,
    showDeviceDetectionBtn: {
      type: Boolean,
      default: true,
    },
    showSettingBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-header',
    };
  },
  // computed
  computed: {},
  // watch
  watch: {},
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

    clickDeviceBtn() {
      this.$emit('click-device-btn');
    },

    clickSettingBtn() {
      this.$emit('click-setting-btn');
    },
  },
};
</script>

<style lang="less">
@import "./../../assets/less/var.less";
.rtc-header {
  flex: none;
  display: flex;
  justify-content: space-between;
  padding: 0 @gapBig;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #3F3E42;

  .l-left {
    flex: 1;
  }

  .l-right {
    flex: none;
    display: inline-flex;
    gap: @gapBig;
    font-size: @fontSizeSmall;
    .o-item {
      cursor: pointer;
    }
  }
}
</style>
