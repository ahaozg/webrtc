<template>
  <div class="cc-input"
       :class="{'is-focus': focused, disabled, readonly}"
       @mouseenter="hovering = true"
       @mouseleave="hovering = false">
    <input
      class="cc-input__inner"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="inputDisabled"
      :readonly="readonly"
      ref="input"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
    <!-- 后置内容 -->
    <span
      class="cc-input__suffix c-icon-wrap"
      v-if="showClear">
        <i class="cc-input__icon rtc-icon-close cc-input__clear"
           @mousedown.prevent
           @click="clear"
        ></i>
    </span>
    <!-- 后置元素 -->
    <div class="cc-input-group__append c-icon-wrap" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
import {isKorean} from '../../../utils/utils';
export default {
  inheritAttrs: false,
  name: 'cc-input',
  // components
  components: {},
  // props
  props: {
    value: [String, Number],
    disabled: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    placeholder: {
      type: String,
      default: '请输入',
    },
  },
  data() {
    return {
      // name
      name: 'cc-input',
      hovering: false,
      focused: false,
      isComposing: false,
    };
  },
  // computed
  computed: {
    inputDisabled() {
      return this.disabled;
    },
    nativeInputValue() {
      return this.value === null || typeof this.value === 'undefined' ? '' : String(this.value);
    },
    showClear() {
      return this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering);
    },
  },
  // watch
  watch: {
    nativeInputValue() {
      this.setNativeInputValue();
    },
  },
  created() {
    // created
  },
  mounted() {
    // mounted
    this.setNativeInputValue();
  },
  beforeDestroy() {
    // beforeDestroy
  },
  methods: {

    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    select() {
      this.getInput().select();
    },
    handleCompositionStart() {
      this.isComposing = true;
    },
    handleCompositionUpdate(event) {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || '';
      this.isComposing = !isKorean(lastCharacter);
    },
    handleCompositionEnd(event) {
      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(event);
      }
    },
    getInput() {
      return this.$refs.input;
    },
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) {
        return;
      }
      if (input.value === this.nativeInputValue) {
        return;
      }
      input.value = this.nativeInputValue;
    },
    handleInput(event) {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (this.isComposing) {
        return;
      }

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === this.nativeInputValue) {
        return;
      }

      this.$emit('input', event.target.value);

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
    },
    clear() {
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
  },
};
</script>

<style lang="less">
@import "../../../assets/less/var.less";

.cc-input {
  display: flex;
  align-items: center;
  padding-left: @gapBase;
  line-height: @heightBase;
  font-size: @fontSizeSmall;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background-color: transparent;
  &:hover,
  &:focus,
  &.is-focus {
    border-color: rgba(255, 255, 255, 0.65);
  }

  &.disabled {
    border-color: rgba(255, 255, 255, 0.25);
    .cc-input__inner {
      cursor: not-allowed;
    }
  }

  &.readonly {
    border-color: rgba(255, 255, 255, 0.25);
  }

  .cc-input__inner {
    flex: 1;
    background-color: transparent;
    color: rgba(255, 255, 255, 0.65);
    border: 0;

    &:hover,
    &:focus {
      border: 0;
      outline: none;
    }
  }

  .cc-input__suffix,
  .cc-input-group__append {
    flex: none;
    width: 32px;
    color: #c0c4cc;
  }
}
</style>
