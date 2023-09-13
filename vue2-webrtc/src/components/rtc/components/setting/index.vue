<template>
  <ccDialog
    class="rtc-setting-popup"
    :visible.sync="visible"
    :transfer-dom="transferDom"
    @close="closePopup">
    <div class="cc-dialog_header">
      <div class="l-left o-ellipsis">设置</div>
      <div class="l-right" v-if="showCloseBtn">
        <div class="c-icon-wrap" @click="closePopup"><i class="rtc-icon-close"></i></div>
      </div>
    </div>
    <div class="cc-dialog_body">
      <ul class="setting-opera">
        <li class="setting-opera-bar">
          <div class="setting-opera-bar-inner"
               :style="{
                   height: `${activeOpera && activeOpera.height ? activeOpera.height : 0}px`,
                   transform: `translateY(${activeOpera && activeOpera.translateY ? activeOpera.translateY : 0}px)`
                 }"></div>
        </li>
        <li class="setting-opera-item"
            :class="{active: activeOperaId === opera.id}"
            v-for="opera in operaList"
            :key="opera.id"
            :ref="opera.ref"
            v-text="opera.name"
            @click="clickOpera(opera)"></li>
        <li class="setting-opera-item-fill"></li>
      </ul>
      <component class="setting-main"
                 ref="refComponent"
                 :is="currentComponent"></component>
    </div>
  </ccDialog>
</template>

<script>
import ccDialog from '../../components/common/dialog/index.vue';
import settingCamera from './setting-camera';
import settingMic from './setting-microphone';
import settingNetwork from './setting-network';
import settingVoice from './setting-voice';

export default {
  name: 'rtc-setting',
  // components
  components: {
    ccDialog,
    settingCamera,
    settingMic,
    settingNetwork,
    settingVoice,
  },
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
    settingOperaList: {
      type: Array,
      default: () => ([
        {
          id: 'voice',
          name: '扬声器',
          component: 'settingVoice',
          ref: 'refVoice',
        },
        {
          id: 'microphone',
          name: '麦克风',
          component: 'settingMic',
          ref: 'refMic',
        },
        {
          id: 'camera',
          name: '摄像头',
          component: 'settingCamera',
          ref: 'refCamera',
        },
        {
          id: 'network',
          name: '网络检测',
          component: 'settingNetwork',
          ref: 'refNetwork',
        },
      ]),
    },
  },
  data() {
    return {
      // name
      name: 'rtc-setting',
      // 操作列表
      operaList: [],
      activeOpera: {},
      activeOperaId: '',
      // 当前组件
      currentComponent: '',
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
    settingOperaList() {
      this.setOperaList();
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
      if (visible) {
        this.setOperaList();
      } else {
        this.$nextTick(() => {
          // 重置数据
          this.activeOperaId = '';
          this.activeOpera = {};
          this.$refs.refComponent && this.$refs.refComponent.$destroy();
          this.currentComponent = '';
        });
      }
    },

    closePopup() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },

    setOperaList() {
      const operaList = [];
      this.settingOperaList.forEach(i => {
        i.height = 0;
        i.translateY = 0;
        operaList.push(i);
      });
      this.operaList = operaList;
      this.$nextTick(() => {
        let translateY = 0;
        this.operaList.forEach(opera => {
          const rect = this.$refs[opera.ref][0].getBoundingClientRect();
          opera.height = rect.height;
          opera.translateY = translateY;
          translateY += rect.height;
        });
        if (this.operaList.length > 1) {
          this.activeOperaId = this.operaList[0].id;
          this.activeOpera = this.operaList[0];
          this.currentComponent = this.operaList[0].component;
        }
      });
    },

    clickOpera(opera) {
      this.activeOpera = opera;
      this.activeOperaId = opera.id;
      this.currentComponent = opera.component;
    },
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-setting-popup {
  .cc-dialog_inner {
    width: 660px;
  }

  .cc-dialog_body {
    display: flex;
    flex-direction: row;
    height: 480px;
  }

  .setting-opera {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 88px;
  }

  .setting-opera-bar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    width: 2px;
  }

  .setting-opera-bar-inner {
    width: 100%;
    background: #fff;
    border: 2px;
    transition: transform .2s;
  }

  .setting-opera-item-fill {
    flex: 1;
    border-right: 1px solid #31363B;
  }

  .setting-opera-item {
    position: relative;
    padding-left: 15px;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    border-bottom: 1px solid #31363B;
    border-right: 1px solid #31363B;

    &:hover {
      color: #fff;
    }

    &.active {
      color: #fff;
      background: #28292C;
      font-weight: bold;
      border-right: 1px solid transparent;

    }
  }

  .setting-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
    background-color: #28292C;

    .o-flex {
      gap: 16px;
      .c-microphone-boxes,
      .device-microphone-audio,
      .cc-select,
      .cc-slider {
        flex: 1;
      }
      .c-btn {
        min-width: 102px;
        text-align: center;
      }
      .voice-num {
        min-width: 102px;
        display: inline-flex;
        align-items: center;
      }
    }
  }
}
</style>
