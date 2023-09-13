<template>
  <div class="user-box"
       :class="[`user-box-${user.userId}`]"
       :style="boxStyle">
    <slot name="bg" :user="user">
      <div class="user-bg"></div>
    </slot>
    <div class="play-warp"
         :id="`user_${user.userId}`"
         :ref="`user_${user.userId}`"
         :style="playerStyle"></div>
    <slot name="tag" :user="user">
      <div class="box-tag">
        <slot name="tagPrefix" :user="user">
          <ccMic :isMute="!user.localAudioOpen"
                 :value="user.micLevel" />
        </slot>
        <slot name="tagCenter" :user="user">
          <span class="tag-name" v-text="user.tagName"></span>
        </slot>
        <slot name="tagSuffix" :user="user"></slot>
      </div>
    </slot>
    <slot name="other" :user="user"></slot>
  </div>
</template>

<script>
import ccMic from './../common/cc-mic';

export default {
  name: 'user-box',
  // components
  components: {
    ccMic,
  },
  // props
  props: {
    user: Object,
  },
  data() {
    return {
      // name
      name: 'user-box',
    };
  },
  // computed
  computed: {
    boxStyle() {
      const positions = this.user.positions;
      if (positions) {
        return {
          left: `${positions.left}px`,
          top: `${positions.top}px`,
          width: `${positions.cellWidth}px`,
          height: `${positions.cellHeight}px`,
          isSpeaking: this.user.isSpeaking,
        };
      }
      return {};
    },
    playerStyle() {
      return {
        visibility: this.user.cameraOpen,
      };
    },
  },
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
.user-box {
  position: absolute;

  .user-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: url("./../../assets/images/icon-waiting.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .play-warp {
    position: absolute;
    inset: 0;
    z-index: 2;
    overflow: hidden;
  }

  .box-tag {
    position: absolute;
    left: 4px;
    bottom: 8px;
    z-index: 3;
    display: inline-flex;
    gap: 8px;
    padding-left: 8px;
    padding-right: 8px;
    line-height: 24px;
    height: 24px;
    background-color: rgba(0, 0, 0, 0.59);
    border-radius: 3px;
    max-width: 90%;
    color: #fff;
    transform: translate3d(0, 0, 0);

    .svg-icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
