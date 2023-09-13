<template>
  <div class="rtc-full-screen-tip"
       :data-transfer="true"
       v-transfer-dom="transferDom">
    <slot>
      <div class="item warning"
           v-if="!storeDevice.isBrowserSupported"
           v-text="browserSupportedText"></div>
      <div class="item init"
           v-else-if="storeDevice.hasDeviceAuth === -1"><ccLoading visible content="正在初始化，请稍后..." />
      </div>
      <div class="item device-auth"
           v-else-if="storeDevice.hasDeviceAuth === 0">请在浏览器弹出的使用麦克风/摄像头提醒弹框里操作“允许”
      </div>
    </slot>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import transferDom from './../common/dialog/extend/transfer-dom';
import ccLoading from './../common/loading/index';

export default {
  name: 'rtc-full-screen-tip',
  // directives
  directives: {transferDom},
  mixins: [mixinStore],
  // components
  components: {ccLoading},
  // props
  props: {
    // 弹窗放置哪个元素下面
    transferDom: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Boolean,
      default: 'body',
    },
    // 浏览器是否支持此组件的显示文案
    browserSupportedText: {
      type: String,
      default: '系统不兼容您的浏览器版本，请使用最新版的谷歌浏览器（Chrome）登录！',
    },
  },
  data() {
    return {
      // name
      name: 'rtc-full-screen-tip',
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
.rtc-full-screen-tip {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  &:empty {
    display: none;
  }

  .item {
    display: flex;
    flex-direction: column;
    //justify-content: center;
    align-items: center;
    &::before {
      content: "";
      display: inline-block;
      margin-bottom: 24px;
      width: 180px;
      height: 180px;
      background-size: auto;
      background-repeat: no-repeat;
      background-position: center;
    }

    &.warning::before {
      margin-bottom: 0;
      width: 560px;
      height: 285px;
      background-image: url("./../../assets/images/icon-warning.png");
    }

    &.device-auth::before {
      width: 560px;
      height: 285px;
      background-image: url("./../../assets/images/icon-device-auth.png");
    }

    &.empty::before {
      background-image: url("./../../assets/images/icon-empty.png");
    }

    &.error::before {
      background-image: url("./../../assets/images/icom-msg.png");
    }

    &.disconnect::before {
      background-image: url("./../../assets/images/icon-disconnect.png");
    }
  }
}
</style>
