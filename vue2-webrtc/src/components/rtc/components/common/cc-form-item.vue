<template>
  <div class="cc-form-item"
       :class="{
         required,
         'is-error': !!errorTip.length,
         'label-position-left': labelPosition === 'left',
         'label-position-right': labelPosition === 'right'
       }"
       :style="{paddingLeft: labelWidth}">
    <slot name="label" v-bind:labelStyle="getLabelStyle">
      <label class="o-label" :style="getLabelStyle" v-text="label"></label>
    </slot>
    <slot :style="{marginLeft: labelWidth}"></slot>
    <div class="o-error" v-if="!!errorTip.length" v-text="errorTip"></div>
  </div>
</template>

<script>
export default {
  name: 'cc-form-item',
  // components
  components: {},
  // props
  props: {
    // required
    required: {
      type: Boolean,
      default: false,
    },
    // label
    label: {
      type: String,
      default: '',
    },
    // labelWidth
    labelWidth: {
      type: String,
      default: '0px',
    },
    // labelPosition
    labelPosition: {
      type: String,
      default: 'left',
    },
    // position水平时的垂直方向
    labelVertical: {
      type: String,
      default: 'middle',
    },
    // 错误提示
    errorTip: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // name
      name: 'cc-form-item',
    };
  },
  // computed
  computed: {
    getLabelStyle() {
      const _style = {
        'text-align': this.labelPosition,
        'justify-content': this.labelPosition,
        width: this.labelWidth,
      };
      switch (this.labelVertical) {
        case 'middle':
          _style.top = '50%';
          break;
        case 'top':
          _style.top = '17px';
          break;
        case 'bottom':
          _style.bottom = '17px';
          break;
        default:
          break;
      }
      return _style;
    },
  },
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
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.cc-form-item {
  position: relative;

  &.required {
    padding-bottom: 20px;

    + .cc-form-item {
      margin-top: 0;
    }
  }

  &.is-error {
    padding-bottom: 0;
  }

  &.no-padding-bottom {
    padding-bottom: 0;
  }

  .o-label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    padding-right: 8px;
    color: rgba(255, 255, 255, 0.65);

    &.flex {
      display: flex;
      align-items: center;
    }
  }

  &.required.label-position-left .o-label::after {
    content: "*";
    color: @colorError;
    margin-left: 4px;
  }

  &.required.label-position-right .o-label::before {
    content: "*";
    color: @colorError;
    margin-right: 4px;
  }

  .o-error {
    min-height: 14px;
    line-height: 30px;
  }

  & + .cc-form-item {
    margin-top: 20px;
  }
}
</style>
