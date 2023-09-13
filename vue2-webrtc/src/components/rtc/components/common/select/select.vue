<template>
  <div class="cc-select">
    <cc-input :id="inputId"
              ref="refInput"
              v-model="selectedLabel"
              :class="{ 'is-focus': visible }"
              :placeholder="currentPlaceholder"
              :disabled="selectDisabled"
              :readonly="readonly"
              @keyup.native="debouncedOnInputChange"
              @keydown.native.down.stop.prevent="navigateOptions('next')"
              @keydown.native.up.stop.prevent="navigateOptions('prev')"
              @keydown.native.enter.prevent="selectOption"
              @keydown.native.esc.stop.prevent="hidePoptip"
              @keydown.native.tab="hidePoptip"
              @paste.native="debouncedOnInputChange"
              @mouseenter.native="inputHovering = true"
              @mouseleave.native="inputHovering = false">
      <template slot="append">
        <i v-show="!showClose" :class="['cc-select__caret', 'o-quarter', 'rtc-icon-' + iconClass]"></i>
        <i v-if="showClose" class="cc-select__caret cc-input__icon rtc-icon-close" @click="handleClearClick"></i>
      </template>
    </cc-input>
    <cc-poptip :link-id="inputId"
               ref="refPoptip"
               class="cc-select__drown"
               v-if="selectReady"
               :transfer="transfer"
               hideArrow
               placement="bottom-start"
               @change="poptipVisibleChange">
      <ul class="cc-select_container"
          v-if="filterList && filterList.length">
        <li class="o-item"
            :class="[
              `js_${item[listKey]}`,
               {
                 disabled: item.disabled,
                 hover: index === hoverIndex,
                 selected: selected[listKey] === item[listKey]
               }
           ]"
            v-for="(item, index) of filterList"
            :key="`${item[listKey]}_${index}`"
            :title="item.title || (item.disabled && disabledTitle)"
            @click="handleSelect(item)">
          <slot :item="item" :index="index">
            <div class="o-label o-ellipsis" :title="item.label" v-text="item.label"></div>
          </slot>
        </li>
      </ul>
      <template v-if="emptyText">
        <div class="cc-select-dropdown__empty"
              v-text="emptyText"></div>
      </template>
    </cc-poptip>
  </div>
</template>

<script>
import {getUUID, debounce} from '../../../utils/utils';
import ccInput from '../../../components/common/input/input.vue';
import ccPoptip from '../../../components/common/poptip/index.vue';

export default {
  name: 'cc-select',
  // components
  components: {ccInput, ccPoptip},
  // props
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    value: String | Number,
    list: {
      type: Array,
      default: () => ([]),
    },
    listKey: {
      type: String,
      default: 'id',
    },
    listLabel: {
      type: String,
      default: 'label',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    disabledTitle: String,
    // 是否将弹层放置在body上
    transfer: {
      type: Boolean,
      default: true,
    },
    noDataText: String,
    loading: Boolean,
    loadingText: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
  },
  data() {
    return {
      // name
      name: 'cc-select',
      inputId: `js_${getUUID()}`,
      selectReady: false,
      visible: false,
      filteredOptionsCount: 0,
      query: '',
      previousQuery: null,
      inputHovering: false,
      selectedLabel: '',
      oldSelected: {},
      selected: {},
      inputLength: 20,
      currentPlaceholder: '',
      cachedPlaceHolder: '',
      filterList: [],
      hoverIndex: -1,
    };
  },
  // computed
  computed: {
    emptyText() {
      if (this.loading) {
        return this.loadingText || '暂无数据';
      }
      if (this.filterable && this.query && this.filterList?.length === 0) {
        return this.noMatchText || '无匹配数据';
      }
      if (this.list?.length === 0) {
        return this.noDataText || '暂无数据';
      }
      return null;
    },
    iconClass() {
      return this.visible ? 'arrow is-reverse' : 'arrow';
    },
    showClose() {
      const hasValue = this.selected[this.listKey];
      return this.clearable &&
        !this.selectDisabled &&
        this.inputHovering &&
        hasValue;
    },
    selectDisabled() {
      return this.disabled;
    },
    readonly() {
      return !this.filterable || !this.visible;
    },
    optionsAllDisabled() {
      return this.filterList.every(option => option.disabled);
    },
  },
  // watch
  watch: {
    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },
    list() {
      this.filterList = this.list;
      if (this.filterable && this.selected[this.listKey]) {
        this.checkDefaultFirstOption();
      }
      this.setSelected();
    },
    value: {
      handler() {
        this.setSelected();
        if (this.filterable) {
          this.inputLength = 20;
        }
      },
      immediate: true,
    },
    visible(val) {
      if (!val) {
        this.query = '';
        this.previousQuery = null;
        this.selectedLabel = '';
        this.resetHoverIndex();
        if (this.selected) {
          this.selectedLabel = this.selected ? this.selected[this.listLabel] : '';
          if (this.filterable) {
            this.query = this.selectedLabel;
          }
        }
        if (this.filterable) {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
      } else if (this.filterable) {
        this.query = this.selectedLabel;
        if (this.selectedLabel) {
          this.currentPlaceholder = this.selectedLabel;
          this.selectedLabel = '';
        }
        this.handleQueryChange(this.query);
        this.query = this.selectedLabel;
      }
      this.$emit('visible-change', val);
    },
  },
  created() {
    // created
    const delay = 50;
    this.debouncedOnInputChange = debounce(this.onInputChange, delay);
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
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      this.$nextTick(() => {
        this.selectReady = true;
      });
    },

    poptipVisibleChange(visible) {
      this.visible = visible;
    },

    setSelected(item) {
      if (item) {
        this.oldSelected = this.selected;
        this.selectedLabel = item[this.listLabel];
        this.selected = item;
      } else if (this.list) {
        const target = this.list.find(i => i[this.listKey] === this.value);
        if (target) {
          this.oldSelected = this.selected;
          this.selectedLabel = target[this.listLabel];
          this.selected = target;
        } else {
          this.selectedLabel = this.$options.data().selectedLabel;
          this.selected = this.$options.data().selected;
          // this.currentPlaceholder = '';
        }
      }
      if (this.filterable) {
        this.query = this.selectedLabel;
      }
      if (this.filterable && this.selected[this.listKey]) {
        this.checkDefaultFirstOption();
      }
    },

    handleClearClick(event) {
      this.deleteSelected(event);
    },

    deleteSelected(event) {
      event.stopPropagation();
      this.oldSelected = this.selected;
      this.selected = {};
      this.hoverIndex = -1;
      this.filterList = this.list;
      const value = '';
      this.selectedLabel = '';
      this.$emit('input', value);
      this.emitChange(value);
      this.hidePoptip();
      this.$emit('clear');
    },

    emitChange(val) {
      this.$emit('change', val);
    },

    handleSelect(item) {
      if (item.disabled) {
        return;
      }
      if (this.selected[this.listKey] === item[this.listKey]) {
        this.setInputFocus();
        this.hidePoptip();
        return;
      }
      this.$emit('input', item[this.listKey]);
      this.emitChange(item[this.listKey]);
      this.setInputFocus();
      this.hidePoptip();
    },

    setInputFocus() {
      this.$refs.refInput?.focus();
    },

    showPoptip() {
      this.$refs.refPoptip?.setVisibleTrue();
    },

    hidePoptip() {
      this.$refs.refPoptip?.setVisibleFalse();
    },

    handleQueryChange(val) {
      if (this.previousQuery === val) {
        this.filterList = this.list;
        return;
      }
      this.previousQuery = val;
      this.hoverIndex = -1;
      if (!val || !this.selectedLabel) {
        this.filterList = this.list;
        if (this.filterable && this.selected[this.listKey]) {
          this.checkDefaultFirstOption();
        }
        return;
      }
      // 过滤
      this.filterList = this.list?.filter(i => i[this.listLabel].indexOf(val) !== -1) || [];
      if (this.filterable && this.selected[this.listKey]) {
        this.checkDefaultFirstOption();
      }
    },

    onInputChange() {
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel;
        this.handleQueryChange(this.query);
      }
    },

    resetHoverIndex() {
      const temp = setTimeout(() => {
        window.clearTimeout(temp);
        this.hoverIndex = this.filterList.findIndex(i => i[this.listKey] === this.selected[this.listKey]);
        // eslint-disable-next-line no-magic-numbers
      }, 300);
    },

    navigateOptions(direction) {
      if (!this.visible) {
        this.showPoptip();
        return;
      }
      if (this.filterList.length === 0) {
        return;
      }
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.filterList.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.filterList.length - 1;
          }
        }
        const option = this.filterList[this.hoverIndex];
        if (option.disabled === true) {
          this.navigateOptions(direction);
        }
        this.$nextTick(() => this.scrollToOption(this.filterList[this.hoverIndex]));
      }
    },

    scrollToOption(option) {
      this.$refs.refPoptip?.setInnerScrollTop(`.js_${option[this.listKey]}`, false);
    },

    selectOption() {
      if (!this.visible) {
        if (!this.selectDisabled) {
          this.showPoptip();
        }
      } else {
        const target = this.filterList[this.hoverIndex];
        target && (this.handleSelect(target));
      }
    },

    checkDefaultFirstOption() {
      if (this.selected[this.listKey] && this.filterList) {
        this.hoverIndex = this.filterList.findIndex(i => i[this.listKey] === this.selected[this.listKey]);
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../assets/less/var.less";
.cc-select {
  .cc-select__caret {

  }
  .rtc-icon-arrow {
    transition: transform linear .2s;
    &.o-quarter {
      transform: rotate(-90deg);
    }
    &.is-reverse {
      transform: rotate(-270deg);
    }
  }
}

.cc-select__drown.vcc-poptip {
  background-color: transparent;

  .vcc-poptip-inner {
    max-height: 49vh;
    overflow-y: auto;
    overflow-x: hidden;
    background: #333438;
    border-color: #333438;
  }

  .cc-select_container {
    padding: @gapSmall 0;
    .o-item {
      padding: 0 @gapBase;
      line-height: @heightBig;
      font-size: @fontSizeSmall;
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
      cursor: pointer;

      &.hover,
      &:hover {
        background: #46484E;
      }

      &.selected {
        color: rgba(255, 255, 255, 0.65);
        background: #46484E;
      }

      &.disabled {
        border-color: rgba(255, 255, 255, 0.25);
        cursor: not-allowed;
      }
    }
  }

  .cc-select-dropdown__empty {
    padding: @gapSmall @gapBase;
    line-height: @heightBig;
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    text-align: center;
    font-size: @fontSizeSmall;
  }
}
</style>
