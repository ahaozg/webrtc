<template>
  <div class="btn-opera c-btn-icon c-btn-icon--vertical btn-screen-share"
       v-if="show">
    <div class="l-top">
      <i class="rtc-icon-share"></i>
    </div>
    <div class="l-bottom">屏幕共享</div>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';

export default {
  name: 'btn-screen-share',
  mixins: [mixinStore],
  // components
  components: {},
  // props
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'btn-screen-share',
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
.btn-screen-share {

}
</style>
