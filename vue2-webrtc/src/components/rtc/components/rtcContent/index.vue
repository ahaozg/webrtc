<template>
  <main class="rtc-content"
        ref="refContent"
        id="rtcContent"
        @transitionend="handleMainTransitionend">
    <userBox v-for="user in playView"
             :key="user.userId"
             :user="user">
      <template #bg>
        <slot name="userBg" :user="user"></slot>
      </template>
      <template #tag>
        <slot name="userTag" :user="user"></slot>
      </template>
      <template #tagPrefix>
        <slot name="userTagPrefix" :user="user"></slot>
      </template>
      <template #tagCenter>
        <slot name="userTagCenter" :user="user"></slot>
      </template>
      <template #tagSuffix>
        <slot name="userTagSuffix" :user="user"></slot>
      </template>
      <template #other>
        <slot name="userOther" :user="user"></slot>
      </template>
    </userBox>
  </main>
</template>

<script>
import mixinStore from '../../store/mixinStore';
import emitter, {UIEvents} from '../../common/emitter/event';
import userBox from './../userBox/index';

export default {
  name: 'rtc-content',
  mixins: [mixinStore],
  // components
  components: {userBox},
  // props
  props: {
    users: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      // name
      name: 'rtc-content',
    };
  },
  // computed
  computed: {
    playView() {
      const auxStream = this.users.find(u => u.hasAux);
      if (auxStream) {
        return [{
          ...auxStream,
          userId: `aux_${auxStream.userId}`,
        }, ...this.users];
      }
      return [...this.users];
    },
  },
  // watch
  watch: {},
  created() {
    // created
    emitter.on(UIEvents.WINDOW_RESIZE, this.handleResize);
    this.init();
  },
  mounted() {
    // mounted
  },
  beforeDestroy() {
    // beforeDestroy
    emitter.off(UIEvents.WINDOW_RESIZE, this.handleResize);
  },
  methods: {

    /**
     * 初始化方法
     * @return {void}
     */
    init() {
      this.$nextTick(() => {
        this.getMainRect();
      });
    },

    handleMainTransitionend() {
      this.getMainRect();
    },

    handleResize() {
      this.getMainRect();
    },

    getMainRect() {
      const rect = this.$refs.refContent.getBoundingClientRect();
      this.$emit('mainRect', rect);
      return rect;
    },
  },
};
</script>

<style lang="less">
.rtc-content {
  position: relative;
  flex: auto;
}
</style>
