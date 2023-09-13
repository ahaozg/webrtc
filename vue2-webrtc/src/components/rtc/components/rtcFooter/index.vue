<template>
  <footer class="rtc-footer">
    <div class="l-left">
      <slot name="left">
        <slot name="leftPrefix"></slot>
        <btnScreenShare :show="showScreenShareBtn" />
        <slot name="leftSuffix"></slot>
      </slot>
    </div>
    <div class="l-center">
      <slot name="center">
        <slot name="centerPrefix"></slot>
        <btnMic :show="showMicBtn" />
        <btnCamera :show="showCameraBtn" />
        <btnVoice :show="showVoiceBtn" />
        <btnNetwork :show="showNetworkBtn" />
        <slot name="centerSuffix"></slot>
      </slot>
    </div>
    <div class="l-right">
      <slot name="right"></slot>
    </div>
  </footer>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import btnMic from './../btnMic/index';
import btnCamera from './../btnCamera/index';
import btnVoice from './../btnVoice/index';
import btnNetwork from './../btnNetwork/index';
import btnScreenShare from './../btnScreenShare/index';

export default {
  name: 'rtc-footer',
  mixins: [mixinStore],
  // components
  components: {
    btnMic,
    btnCamera,
    btnVoice,
    btnNetwork,
    btnScreenShare,
  },
  // props
  props: {
    showScreenShareBtn: {
      type: Boolean,
      default: true,
    },
    showMicBtn: {
      type: Boolean,
      default: true,
    },
    showCameraBtn: {
      type: Boolean,
      default: true,
    },
    showVoiceBtn: {
      type: Boolean,
      default: true,
    },
    showNetworkBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-footer',
    };
  },
  // computed
  computed: {},
  // watch
  watch: {},
  created() {
    // created
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
  },
  methods: {

    /**
     * 初始化方法
     * @return {void}
     */
    init() {
      //
    },
  },
};
</script>

<style lang="less">
.rtc-footer {
  position: relative;
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  color: #CFD8E1;
  background-color: #3F3E42;
  .l-left {
    display: flex;
    height: 100%;

    > span {
      height: 62px;
    }
  }

  .l-center {
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
  }

  .l-right {
    display: flex;
    align-items: center;
    padding-right: 16px;
    height: 100%;
  }

  .btn-opera {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    cursor: pointer;
    .l-top {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 24px;
      flex: 0;
    }
    .l-bottom {
      line-height: 16px;
    }
  }
}
</style>
