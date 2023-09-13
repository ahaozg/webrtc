/**
 *@file index
 *@version 1.0.1
 *@author yangbowen
 *@createTime 2019/10/18 - 11:33
 *@updateTime 2019/10/18 - 11:33
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description 防抖函数 的描述
 */
export default {
  // bind 指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置,比如我们可以设置样式
  bind(el) {
    // eslint-disable-next-line
        console.log(el);
  },
  // 被绑定的元素插入到父节点时
  inserted(el, binding) {
    el.addEventListener('click', function () {
      if (!binding.value.disabled) {
        // 禁止点击的时间
        const time = binding.value.time;
        // 执行自定义方法
        binding.value.methods();
        // 置为不可点的状态
        binding.value.disabled = true;
        clearTimeout(el.timeId);
        el.timeId = setTimeout(() => {
          // time秒后清除不可点的状态 置为可点
          binding.value.disabled = false;
        }, time);
      }
    });
  },
};
