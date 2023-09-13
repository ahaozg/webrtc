<template>
  <div class="cc-dialog_wrap"
       :class="getClass"
       :data-transfer="true"
       v-transfer-dom="transferDom"
       v-show="visible"
       @click.self="handleWrapperClick">
    <div class="cc-dialog_inner"
         ref="refDialog"
         :key="key">
      <slot></slot>
    </div>
  </div>
</template>
<!--js-->
<script src="./index.js"></script>
<!--样式表-->
<style lang="less">
@import "../../../assets/less/var.less";
@import "./index.less";
</style>
