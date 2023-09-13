<template>
  <div id="jsRtc" class="cc-rtc">
    <slot name="header">
      <rtcHeader
        v-bind="$attrs"
        :coreReady="coreReady"
        @click-device-btn="clickDeviceBtn"
        @click-setting-btn="clickSettingBtn"/>
    </slot>
    <slot name="aside"></slot>
    <slot name="content" :users="storeRoom.users">
      <rtcContent
        v-bind="$attrs"
        :users="storeRoom.users"
        @mainRect="setMainRect">
        <template #userBg="{user}">
          <slot name="contentUserBg" :user="user"></slot>
        </template>
        <template #userTag="{user}">
          <slot name="contentUserTag" :user="user"></slot>
        </template>
        <template #userTagPrefix="{user}">
          <slot name="contentUserTagPrefix" :user="user"></slot>
        </template>
        <template #userTagCenter="{user}">
          <slot name="contentUserTagCenter" :user="user"></slot>
        </template>
        <template #userTagSuffix="{user}">
          <slot name="contentUserTagSuffix" :user="user"></slot>
        </template>
        <template #userOther="{user}">
          <slot name="contentUserOther" :user="user"></slot>
        </template>
      </rtcContent>
    </slot>
    <slot name="footer" v-if="enterRoomSuccess">
      <rtcFooter v-bind="$attrs">
        <template #left>
          <slot name="footerLeft"></slot>
        </template>
        <template #leftPrefix>
          <slot name="footerLeftPrefix"></slot>
        </template>
        <template #leftSuffix>
          <slot name="footerLeftSuffix"></slot>
        </template>
        <template #center>
          <slot name="footerCenter"></slot>
        </template>
        <template #centerPrefix>
          <slot name="footerCenterPrefix"></slot>
        </template>
        <template #centerSuffix>
          <slot name="footerCenterSuffix"></slot>
        </template>
        <template #right>
          <slot name="footerRight"></slot>
        </template>
      </rtcFooter>
    </slot>

    <!--全屏占位提示-->
    <rtcFullScreenTip
      v-bind="$attrs"
      :transfer-dom="transferDom">
      <slot
        name="fullScreenTip"
        v-bind:isBrowserSupported="storeDevice.isBrowserSupported"
        v-bind:hasDeviceAuth="storeDevice.hasDeviceAuth"></slot>
    </rtcFullScreenTip>

    <!--设备检测-->
    <rtcDevicePopup
      v-if="coreReady"
      :transfer-dom="transferDom"
      :visible.sync="devicePopupVisible"/>

    <!--设置-->
    <rtcSetting
      v-if="coreReady"
      v-bind="$attrs"
      :transfer-dom="transferDom"
      :visible.sync="settingPopupVisible"/>

    <svgAudioClose/>
    <svgAudioOpen/>
    <svgVideoClose/>
    <svgVideoOpen/>
    <svgVoiceClose/>
    <svgVoiceOpen/>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
@import "./assets/less/index.less";

.cc-rtc {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #171921;
  color: #fff;
}
</style>
