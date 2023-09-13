/**
 *@version 1.0.0
 *@author haozhenguang
 *@createTime 2021/9/27
 *@updateTime 2021/9/27
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description vccPoptip 弹窗组件相关js
 */

// @popperjs/core的官网为  https://popper.js.org/docs/v2/tutorial/
import {createPopper} from '@popperjs/core';
import transferDom from './extend/transfer-dom';

const paddingHorizontal = 8;

// 导出模块
export default {
  name: 'vccPoptip',
  // directives
  directives: {transferDom},
  props: {
    // 默认是否展示
    value: {
      type: Boolean,
      default: false,
    },
    // 链接定位元素id
    linkId: {
      type: String,
      default: '',
    },
    // 触发方式
    trigger: {
      type: [Array, String],
      default: 'click',
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '',
    },
    // 是否隐藏箭头
    hideArrow: {
      type: Boolean,
      default: false,
    },
    // 是否将弹层放置在body上
    transfer: {
      type: Boolean,
      default: false,
    },
    // 自定义class
    popperClass: {
      type: String,
      default: '',
    },
    // 偏移量
    offset: {
      type: Array,
      default: () => ([0, paddingHorizontal]),
    },
    // 出现位置
    placement: {
      type: String,
      // top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
      default: 'bottom',
    },
    // 策略
    strategy: {
      type: String,
      // absolute/fixed
      default: 'absolute',
    },
    // 创建完成，第一次更新后的回调  ps: linkId变化后，会再次触发onFirstUpdate
    onFirstUpdate: {
      type: Function,
      default: () => ({}),
    },
    // 展示时触发的回调
    onShowFun: {
      type: Function,
      default: () => ({}),
    },
    // 隐藏时触发的回调
    onHideFun: {
      type: Function,
      default: () => ({}),
    },
    // 自定义popperInstance的配置项
    options: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // popper 实例
      popperInstance: null,
      // 定位元素
      posEl: null,
      // 当前弹窗组件是否展示的状态
      visible: this.value,
    };
  },
  // computed
  computed: {
    // 计算作用于定位元素的事件
    getPosElEventByTrigger() {
      let trigger = [];
      // 数组
      if (Object.prototype.toString.call(this.trigger) === '[object Array]') {
        trigger = this.trigger;
      } else {
        trigger.push(this.trigger);
      }
      const showEvents = [];
      const hideEvents = [];
      trigger.forEach(item => {
        // 触发类型
        switch (item) {
          case 'click':
            showEvents.push('click');
            break;
          case 'focus':
            showEvents.push('focus');
            hideEvents.push('blur');
            break;
          case 'hover':
            showEvents.push('mouseenter');
            hideEvents.push('mouseleave');
            break;
          default:
            break;
        }
      });
      return {
        showEvents,
        hideEvents,
      };
    },
    // 获取class
    getClass() {
      return [this.popperClass];
    },
  },
  // watch
  watch: {
    // linkId
    linkId: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            if (this.posEl) {
              // 先移除之前绑定的事件
              this.unbindEventByPosEl();
              // 先销毁之前的popper
              this.destroyPopper();
            }
            // 设置定位元素
            this.setPosEl();
            // 定位元素绑定事件
            this.bindEventByPosEl();
            // 创建popper
            this.createPopper();
          });
        }
      },
      immediate: true,
    },
    // visible
    visible: {
      handler(newVal) {
        this.$nextTick(() => {
          if (!this.posEl) {
            // 设置定位元素
            this.setPosEl();
            // 定位元素绑定事件
            this.bindEventByPosEl();
            // 创建popper
            this.createPopper();
          }
          this.handlerVisibleChange(newVal);
        });
      },
      immediate: true,
    },
  },
  methods: {

    /**
     * @function
     * @memberof module:template
     * @description 设置定位元素
     * @param {Object} el - dom定位元素对象
     * @return {undefined} 无返回值
     */
    setPosEl(el) {
      this.posEl = el || document.querySelector(`#${this.linkId}`);
    },

    /**
     * @function
     * @memberof module:template
     * @description 定位元素绑定事件
     * @return {undefined} 无返回值
     */
    bindEventByPosEl() {
      if (!this.posEl) {
        return;
      }
      // 获取trigger事件
      const {showEvents, hideEvents} = this.getPosElEventByTrigger;
      // 展示绑定
      showEvents && showEvents.forEach((event) => {
        this.posEl.addEventListener(event, this.setVisibleTrue);
        // 销毁时移除监听
        this.$once('hook:beforeDestroy', () => {
          this.posEl.removeEventListener(event, this.setVisibleTrue);
        });
      });
      // 点击事件特殊处理
      if (showEvents && showEvents.includes('click')) {
        this.specialHandlerClickOutside();
      }
      // 隐藏绑定
      hideEvents && hideEvents.forEach((event) => {
        this.posEl.addEventListener(event, this.setVisibleFalse);
        // 销毁时移除监听
        this.$once('hook:beforeDestroy', () => {
          this.posEl.removeEventListener(event, this.setVisibleFalse);
        });
      });
    },

    /**
     * @function
     * @memberof module:template
     * @description 定位元素解绑事件
     * @return {undefined} 无返回值
     */
    unbindEventByPosEl() {
      const {showEvents, hideEvents} = this.getPosElEventByTrigger;
      // 展示绑定
      showEvents && showEvents.forEach((event) => {
        this.posEl.removeEventListener(event, this.setVisibleTrue);
      });
      // 点击事件特殊处理
      if (showEvents && showEvents.includes('click')) {
        this.specialHandlerClickOutside();
      }
      // 隐藏绑定
      hideEvents && hideEvents.forEach((event) => {
        this.posEl.removeEventListener(event, this.setVisibleFalse);
      });
    },

    /**
     * @function
     * @memberof module:template
     * @description 定位元素特殊处理点击外面事件
     * @return {undefined} 无返回值
     */
    specialHandlerClickOutside() {
      document.addEventListener('click', this.documentHandlerClick);
      // 销毁时移除监听
      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('click', this.documentHandlerClick);
      });
    },

    /**
     * @function
     * @memberof module:template
     * @description 处理点击事件
     * @param {Object} event - 事件
     * @return {Boolean} 无意义，提前结束函数
     */
    documentHandlerClick(event) {
      // 当前弹窗展示时才需要判断要不要隐藏
      if (!this.visible) {
        return false;
      }
      const e = event || window.event;
      // 定位元素是否包括当前点击的元素
      const posElContainsTarget = this.posEl.contains(e.target);
      // event中是否包含忽略class
      const isIgnore = this.judgeHasIgnoreClass(event);
      // 定位元素不包括当前点击的元素 && 不包含忽略class
      if (!posElContainsTarget && !isIgnore) {
        // 隐藏弹窗
        this.setVisibleFalse();
      }
    },

    /**
     * @function
     * @memberof module:template
     * @description event中是否包含忽略class
     * @param {Object} event - 事件
     * @return {Boolean} true为包含/false为不包含
     */
    judgeHasIgnoreClass(event) {
      if (event) {
        const e = event || window.event;
        const target = e.target;
        // 自身含有忽略class
        if (target.classList && target.classList.contains('js-ignore-poptip')) {
          return true;
        }
        // 或者点击的元素祖先有忽略class则忽略
        const paths = e.path;
        let flag = false;
        // chrome
        if (paths) {
          for (let i = 0; i < paths.length; i++) {
            if (paths[i].classList && paths[i].classList.contains('js-ignore-poptip')) {
              flag = true;
              break;
            }
          }
        } else if (this.judgeParentNodeHasIgnoreClass(target, 'js-ignore-poptip')) {
          // ie firefox
          flag = true;
        }
        // 包含则直接返回
        return flag;
      }
      return false;
    },

    /**
     * @function
     * @memberof module:template
     * @description 判断父节点中是否含有忽略class
     * @param {Object} target - 当前元素对象
     * @param {String} ignoreClass - 忽略class
     * @return {Boolean} true为包含/false为不包含
     */
    judgeParentNodeHasIgnoreClass(target, ignoreClass) {
      // 自身含有忽略class
      if (target.classList && target.classList.contains(ignoreClass)) {
        return true;
      }
      // 继续找父节点
      if (target.parentNode) {
        return this.judgeParentNodeHasIgnoreClass(target.parentNode, ignoreClass);
      }
      return false;
    },

    /**
     * @function
     * @memberof module:template
     * @description 设置visible为true
     * @return {undefined} 无返回值
     */
    setVisibleTrue() {
      this.visible = true;
    },

    /**
     * @function
     * @memberof module:template
     * @description 设置visible为false
     * @return {undefined} 无返回值
     */
    setVisibleFalse() {
      this.visible = false;
    },

    /**
     * @function
     * @memberof module:template
     * @description visible变化后的处理函数
     * @param {Boolean} newVal - true/false
     * @return {Boolean} 提前结束函数
     */
    handlerVisibleChange(newVal) {
      // 没有实例对象，直接返回
      if (!this.popperInstance) {
        return false;
      }
      // 事件修饰符实例
      const eventModifier = {
        name: 'eventListeners',
        enabled: true,
      };
      // 显示
      if (newVal) {
        this.setInnerScrollTop();
        // 设置参数
        this.setPopperOptions({modifiers: eventModifier});
        // 更新位置
        this.updatePopper();
        // 触发回调
        if (this.onShowFun && Object.prototype.toString.call(this.onShowFun) === '[object Function]') {
          this.onShowFun();
        }
      } else {
        eventModifier.enabled = false;
        // 设置参数
        this.setPopperOptions({modifiers: eventModifier});
        // 触发回调
        if (this.onHideFun && Object.prototype.toString.call(this.onHideFun) === '[object Function]') {
          this.onHideFun();
        }
      }
      // 向父组件发送消息
      this.$emit('change', this.visible);
    },

    setInnerScrollTop(activeClass = '.selected', isTop = true) {
      const container = this.$refs.refInner;
      const selectEl = container.querySelector(activeClass);
      const containerRect = container.getBoundingClientRect();
      const selectElRect = selectEl?.getBoundingClientRect();
      let top = 0;
      if (containerRect && selectElRect) {
        // 置顶
        if (isTop) {
          top = selectElRect.top - containerRect.top;
        } else {
          const currentTop = container.scrollTop;
          // 上
          const isTopBottomNum = containerRect.top - selectElRect.top;
          // 下
          const isContainBottomNum = containerRect.bottom - selectElRect.bottom;
          if (isTopBottomNum > 0 && isContainBottomNum > 0) {
            top = currentTop - isTopBottomNum;
          } else if (isContainBottomNum < 0 && isTopBottomNum < 0) {
            top = currentTop - isContainBottomNum;
          } else {
            return;
          }
        }
      }
      container.scrollTop = top;
    },

    /**
     * @function
     * @memberof module:template
     * @description 创建popperInstance
     * @return {undefined} 无返回值
     */
    createPopper() {
      if (!this.posEl) {
        return;
      }
      // 相同宽度的修饰符
      const sameWidth = {
        name: 'sameWidth',
        enabled: true,
        phase: 'beforeWrite',
        requires: ['computeStyles'],
        fn: ({state}) => {
          state.styles.popper.width = this.width ? this.width : `${state.rects.reference.width}px`;
        },
        effect: ({state}) => {
          state.elements.popper.style.width = this.width ? this.width : `${state.elements.reference.offsetWidth}px`;
        },
      };
      // 创建popperInstance
      this.popperInstance = createPopper(
        this.posEl,
        this.$el,
        {
          placement: this.placement,
          modifiers: [
            sameWidth,
            {
              name: 'offset',
              options: {offset: this.offset},
            },
          ],
          strategy: this.strategy,
          onFirstUpdate: this.onFirstUpdate,
        },
      );
      // 设置popper配置
      this.setPopperOptions();
      // 销毁时移除监听
      this.$once('hook:beforeDestroy', () => {
        this.destroyPopper();
      });
    },

    /**
     * @function
     * @memberof module:template
     * @description 设置popper参数
     * @param {Object} newOption - popper相关参数，可参考https://popper.js.org/docs/v2/tutorial/
     * @return {undefined} 无返回值
     */
    setPopperOptions(newOption) {
      if (newOption) {
        this.popperInstance.setOptions((options) => ({
          ...options,
          ...newOption,
          modifiers: [
            ...options.modifiers,
            {...newOption.modifiers},
          ],
        }));
      } else if (this.options) {
        this.popperInstance.setOptions((options) => ({
          ...options,
          ...this.options,
          modifiers: [
            ...options.modifiers,
            {...this.options.modifiers},
          ],
        }));
      }
    },

    /**
     * @function
     * @memberof module:template
     * @description 更新Popper， 用于高频更新
     * @return {undefined} 无返回值
     */
    updatePopper() {
      if (this.popperInstance) {
        this.popperInstance.state.elements.popper.style.width = this.width ? this.width : `${this.popperInstance.state.elements.reference.offsetWidth}px`;
        this.popperInstance && this.popperInstance.update();
      }
    },

    /**
     * @function
     * @memberof module:template
     * @description 强制更新， 用于低频更新
     * @return {undefined} 无返回值
     */
    forceUpdatePopper() {
      this.popperInstance && this.popperInstance.forceUpdate();
    },

    /**
     * @function
     * @memberof module:template
     * @description 销毁
     * @return {undefined} 无返回值
     */
    destroyPopper() {
      this.popperInstance && this.popperInstance.destroy();
      this.popperInstance = null;
    },
  },
};
