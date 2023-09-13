/**
 *@version 1.0.0
 *@author haozhenguang
 *@createTime 2021/9/27
 *@updateTime 2021/9/27
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description ccDialog 弹窗组件相关js
 */

import transferDom from './extend/transfer-dom';

// 导出模块
export default {
  name: 'ccDialog',
  // directives
  directives: {transferDom},
  model: {
    prop: 'visible',
  },
  props: {
    // 默认是否展示
    visible: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: '',
    },
    // 弹窗放置哪个元素下面
    transferDom: {
      type: String | Boolean,
      default: 'body',
    },
    // 自定义class
    popperClass: {
      type: String,
      default: '',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    beforeClose: Function,
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      key: 0,
    };
  },
  // computed
  computed: {
    // 获取class
    getClass() {
      return [this.popperClass];
    },
  },
  // computed
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.refDialog.scrollTop = 0;
        });
      } else if (!val) {
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    },
  },
  methods: {

    handleWrapperClick() {
      if (!this.closeOnClickModal) {
        return;
      }
      this.handleClose();
    },

    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },

    hide() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
  },
};
