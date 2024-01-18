<template>
  <div class="btn-opera c-btn-icon c-btn-icon--vertical btn-camera"
       v-if="show && Object.keys(storeRoom.currentUser).length"
       @click="onClickCamera">
    <div class="l-top">
      <svgIcon :icon-class="storeRoom.currentUser.cameraOpen ? 'svg-video-open' : 'svg-video-close'"/>
      <span
        class="c-arrow"
        :class="{r180: visible}"
        @click.stop
        id="jsBtnCameraArrow"></span>
      <cc-poptip
        link-id="jsBtnCameraArrow"
        ref="refPoptip"
        class="rtc-poptip c-dropdown"
        transfer
        trigger="click"
        width="350px"
        placement="top"
        @change="visible = $event">
        <ul class="c-dropdown-inner">
          <li
            class="item"
            v-if="tipText"
            @click="onClickDevice(null)">
            <singleText :text="tipText" />
          </li>
          <template v-else>
            <li
              class="item"
              :class="{active: device.deviceId === camera.deviceId}"
              v-for="device in camera.deviceList"
              :key="device.deviceId"
              @click="onClickDevice(device)">
              <singleText :text="device.label" />
            </li>
          </template>
        </ul>
      </cc-poptip>
    </div>
    <div class="l-bottom">
      {{storeRoom.currentUser.cameraOpen ? '关闭视频' : '开启视频'}}
    </div>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import svgIcon from './../common/svg-icon';
import ccPoptip from './../common/poptip/index.vue';
import singleText from './../common/single-text';
import rtcCore from './../../rtcCore';
import RtcDeviceCamera from '../../rtcCore/RtcDeviceCamera';
import {RoomErrorCode, RoomErrorMessage, StreamTag} from '../../constants/constant';
import emitter, {RtcCoreEvents} from '../../common/emitter/event';

export default {
  name: 'btn-camera',
  mixins: [mixinStore],
  // components
  components: {
    svgIcon,
    ccPoptip,
    singleText,
  },
  // props
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'btn-camera',
      visible: false,
      camera: new RtcDeviceCamera(),
    };
  },
  // computed
  computed: {
    tipText() {
      if (this.camera.errorText) {
        return this.camera.errorText;
      }
      if (this.camera.deviceList.length === 0) {
        return '未检测到摄像头设备';
      }
      return '';
    },
  },
  // watch
  watch: {
    show(val) {
      if (!val) {
        this.$refs.refPoptip?.setVisibleFalse();
      }
    },
  },
  created() {
    // created
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
      this.camera = rtcCore.state.camera;
    },

    onClickDevice(device) {
      if (device) {
        const deviceId = device.deviceId;
        rtcCore.rtcDeviceService?.changeCamera(deviceId, false);
        // todo: 待多设备验证 设备拔出等需要设置
        rtcCore.rtcCloudService?.switchCamera(deviceId);
      }
      this.$refs.refPoptip?.setVisibleFalse();
    },

    // publishCameraStream
    async onClickCamera() {
      const hasCameraVideo = rtcCore.hasLocalStreamVideo();
      if (hasCameraVideo) {
        const result = rtcCore.setLocalStreamMute({
          tag: StreamTag.CAMERA,
          mute: this.storeRoom.currentUser?.cameraOpen,
        });
        if (result) {
          emitter.emit(RtcCoreEvents.SET_USER_INFO, {
            userId: this.storeRoom.roomInfo.userId,
            cameraOpen: !this.storeRoom.currentUser?.cameraOpen,
          });
        }
      } else {
        await rtcCore.publishCameraStream({
          userId: this.storeRoom.roomInfo.userId,
          mute: this.storeRoom.currentUser?.cameraOpen,
          cameraId: rtcCore.state.camera.deviceId,
          successCb: () => {
            emitter.emit(RtcCoreEvents.SET_USER_INFO, {
              userId: this.storeRoom.roomInfo.userId,
              cameraOpen: !this.storeRoom.currentUser?.cameraOpen,
            });
          },
          errorCb: (e) => {
            if (e.code === RoomErrorCode.LOCAL_STREAM_PUBLISHING) {
              emitter.emit(RtcCoreEvents.USER_TIP_MESSAGE, {
                code: RoomErrorCode.LOCAL_STREAM_PUBLISHING,
                message: RoomErrorMessage.LOCAL_STREAM_PUBLISHING,
              });
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="less">
.btn-camera {

}
</style>
