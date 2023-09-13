<template>
    <div class="vcc-poptip js-ignore-poptip"
         :data-show="visible"
         :class="getClass"
         :data-transfer="transfer"
         v-transfer-dom>
        <div class="vcc-poptip-arrow" v-if="!hideArrow" data-popper-arrow></div>
        <div class="vcc-poptip-inner" ref="refInner">
            <slot></slot>
        </div>
    </div>
</template>
<!--js-->
<script src="./index.js"></script>
<!--样式表-->
<style lang="less">
@import "./index.less";
</style>
