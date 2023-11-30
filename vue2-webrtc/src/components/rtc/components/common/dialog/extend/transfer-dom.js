/* eslint-disable */
/*
 * Thanks to: https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js
 * Thanks to: https://github.com/calebroseland/vue-dom-portal
 */
/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
/**
 *
 * @param node
 * @returns {*}
 */
function getTarget(node) {
    if (node === void (0)) {
        node = document.body;
    }
    if (node === true) {
        return document.body;
    }
    return node instanceof window.Node ? node : document.querySelector(node);
}

const directive = {
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
    inserted(el, {value}, vnode) {
    /*
     * if (el.dataset.transfer !== 'true'){
     *     return false;
     * }
     */
        if (el.getAttribute('data-transfer') !== 'true') {
            return false;
        }

        /*
     * 元素增加 v-transfer-dom 类名
     *  el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom';
     *  增加类名应该不需要
     * 父节点
     */
        const parentNode = el.parentNode;
        // 不存在父节点
        if (!parentNode) {
            return;
        }
        // 创建注释节点
        const home = document.createComment('');
        // 是否移出去
        let hasMovedOut = false;

        if (value !== false) {
            // moving out, el is no longer in the document
            parentNode.replaceChild(home, el);
            // moving into new place
            getTarget(value).appendChild(el);
            // 移出去
            hasMovedOut = true;
        }
        if (!el.__transferDomData) {
            // 转换的数据
            el.__transferDomData = {
                // 父元素
                parentNode: parentNode,
                // 元素最初的家
                home: home,
                // 元素被添加到的目标元素
                target: getTarget(value),
                // 是否移出去了
                hasMovedOut: hasMovedOut
            };
        }
    },
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
    componentUpdated(el, {value}) {
    /*
     * if (el.dataset.transfer !== 'true') {
     *     return false;
     * }
     */
        if (el.getAttribute('data-transfer') !== 'true') {
            return false;
        }
        // need to make sure children are done updating (vs. `update`)
        const ref$1 = el.__transferDomData;

        if (!ref$1) {
            return;
        }
        // homes.get(el)
        const parentNode = ref$1.parentNode;
        const home = ref$1.home;
        const hasMovedOut = ref$1.hasMovedOut; // recall where home is

        if (!hasMovedOut && value) {
            // remove from document and leave placeholder
            parentNode.replaceChild(home, el);
            // append to target
            getTarget(value).appendChild(el);
            el.__transferDomData = Object.assign({}, el.__transferDomData, {hasMovedOut: true, target: getTarget(value)});
        } else if (hasMovedOut && value === false) {
            // previously moved, coming back home
            parentNode.replaceChild(el, home);
            el.__transferDomData = Object.assign({}, el.__transferDomData, {hasMovedOut: false, target: getTarget(value)});
        } else if (value) {
            // already moved, going somewhere else
            getTarget(value).appendChild(el);
        }
    },
    // 只调用一次，指令与元素解绑时调用。
    unbind(el) {
    /*
     * if (el.dataset.transfer !== 'true'){
     *     return false;
     * }
     */
        if (el.getAttribute('data-transfer') !== 'true') {
            return false;
        }

        /*
     *  el.className = el.className.replace('v-transfer-dom', '');
     * 无需增加类名
     */
        const ref$1 = el.__transferDomData;
        if (!ref$1) {
            return;
        }
        if (el.__transferDomData.hasMovedOut === true) {
            //  将目标还原到home位置
            if (el.__transferDomData.parentNode) {
                el.__transferDomData.parentNode.appendChild(el);
            }

            /*
       * el.__transferDomData.parentNode &&
       *  销毁移除的元素
       * getTarget(value).removeChild(el);
       */
        }
        // 清空数据
        el.__transferDomData = null;
    }
};

export default directive;
