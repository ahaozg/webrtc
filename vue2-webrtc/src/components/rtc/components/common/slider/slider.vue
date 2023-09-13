<template>
  <div class="cc-slider"
       :class="{disabled}">
    <div class="cc-slider__track"
         :class="{disabled}"
         ref="refTrack"
         @click="handlerClickTrack($event)">
      <div class="cc-slider__bar"
           :style="{width: `${resultValue}%`}"
           :class="{disabled}"></div>
      <div class="cc-slice__thumb"
           :style="{left: `${resultValue}%`}"
           :class="{disabled, dragging}"
           tabindex="0"
           @mousedown="onButtonDown"
           @touchstart="onButtonDown"
           @keydown.left="onLeftKeyDown"
           @keydown.right="onRightKeyDown"
           @keydown.down.prevent="onLeftKeyDown"
           @keydown.up.prevent="onRightKeyDown"></div>
    </div>
  </div>
</template>

<script>
const percentNum = 100;

export default {
  name: 'cc-slider',
  // components
  components: {},
  // props
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // name
      name: 'cc-slider',
      trackSize: 0,
      resultValue: 0,
      dragging: false,
      dragStartX: 0,
      dragCurrentX: 0,
      dragStartValue: 0,
      draggingValue: 0,
    };
  },
  // computed
  computed: {},
  // watch
  watch: {
    value: {
      handler(val) {
        this.resultValue = val;
      },
      immediate: true,
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

    resetTrackSize() {
      if (this.$refs.refTrack) {
        this.trackSize = this.$refs.refTrack.clientWidth;
      }
    },

    handlerClickTrack(e) {
      if (this.disabled || this.dragging) {
        return;
      }
      const trackRect = this.$refs.refTrack.getBoundingClientRect();
      this.setPosition((e.clientX - trackRect.left) / trackRect.width * percentNum);
    },

    setPosition(percent) {
      const half = 2;
      const remainder = percent % this.step;
      let multiple = Math.floor(percent / this.step);
      if (remainder > this.step / half) {
        multiple++;
      }
      const value = multiple * this.step;
      if (value < this.min || value > this.max) {
        return;
      }
      this.resultValue = value;
      this.$emit('input', value);
    },

    onButtonDown(event) {
      if (this.disabled) {
        return;
      }
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },

    onDragStart(event) {
      this.resetTrackSize();
      this.dragging = true;
      this.isClick = true;
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }
      this.dragStartX = event.clientX;
      this.dragStartValue = this.resultValue;
    },

    onDragging(event) {
      if (this.dragging) {
        this.isClick = false;
        let diff = 0;
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        this.dragCurrentX = event.clientX;
        diff = (this.dragCurrentX - this.dragStartX) / this.trackSize * percentNum;
        this.draggingValue = this.dragStartValue + diff;
        this.setPosition(this.draggingValue);
      }
    },

    onDragEnd() {
      if (this.dragging) {
        // 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
        setTimeout(() => {
          this.dragging = false;
          if (!this.isClick) {
            this.setPosition(this.draggingValue);
          }
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },

    onLeftKeyDown() {
      if (this.disabled) {
        return;
      }
      this.setPosition(this.resultValue - this.step / (this.max - this.min) * percentNum);
    },

    onRightKeyDown() {
      if (this.disabled) {
        return;
      }
      this.setPosition(this.resultValue + this.step / (this.max - this.min) * percentNum);
    },
  },
};
</script>

<style lang="less">
.cc-slider {
  &:after,
  &:before {
    display: table;
    content: "";
  }
  .cc-slider__track {
    position: relative;
    width: 100%;
    height: 6px;
    margin: 16px 0;
    background-color: #3e3e3e;
    border-radius: 3px;
    cursor: pointer;
    vertical-align: middle;

    &.disabled {
      cursor: default;
    }
  }
  .cc-slider__bar {
    position: absolute;
    left: 0;
    height: 6px;
    background-color: #fff;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    pointer-events: none;
    &.disabled {
      cursor: default;
      background-color: #C0C4CC;
    }
  }
  .cc-slice__thumb {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -15px;
    transform: translateX(-50%);
    height: 36px;
    width: 36px;
    z-index: 1001;
    background-color: transparent;
    text-align: center;
    user-select: none;
    line-height: normal;
    cursor: grab;
    &.disabled {
      cursor: not-allowed;
     &::after {
       border-color: #C0C4CC;
     }
    }

    &:not(.disabled):hover::after {
      transform: scale(1.2);
    }

    &::after {
      content: "";
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #eeeeef;
      background-color: #eeeeef;
      border-radius: 50%;
      transition: .2s;
    }
  }
}
</style>
