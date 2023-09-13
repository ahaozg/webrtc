<template>
  <div class="rtc-device-result">
    <ul class="device-list">
      <li class="device-list__header">
        <div class="l-left">检测项目</div>
        <div class="l-right">检测结果</div>
      </li>
      <li class="device-list__item"
          v-for="item of list"
          :key="item.id">
        <div class="l-left" v-text="item.name"></div>
        <div class="l-right">
          <span class="device-list-status"
                :class="`status-${item.status}`"
                v-text="item.statusName"></span>
          <span :id="`js${item.id}`" class="o-link">问题排查</span>
          <cc-poptip :link-id="`js${item.id}`"
                     class="rtc-poptip"
                     transfer
                     trigger="click"
                     width="425px"
                     placement="left">
            <div class="device-popover">
              <div class="device-popover__title">请按以下方法排查：</div>
              <div class="device-popover__content o-user-select-auto" v-text="solution[item.id] || ''"></div>
            </div>
          </cc-poptip>
          <span v-if="String(item.status) === '2' && ['camera', 'microphone'].includes(item.id)"
                :id="`js${item.id}Auth`"
                class="o-link"
                @click="toQA($event)">权限问题</span>
          <cc-poptip :link-id="`js${item.id}Auth`"
                     class="rtc-poptip"
                     transfer
                     trigger="click"
                     :width="helpWidth"
                     placement="left">
            <div class="c-help-body">
              <div class="c-help-text-content"
                   v-for="(current) in helpData[item.id]"
                   :id="current.id"
                   :key="current.id">
                <h2 class="c-help-text-title">{{current.title}}</h2>
                <ul class="c-help-text-list">
                  <li class="c-help-text-item"
                      v-for="(content, index) in current.content"
                      :key="`current_${index}`">
                    <p v-text="content.title"></p>
                    <img
                      v-for="url in content.imgs"
                      :key="url"
                      :src="url"
                      @load="handleImgLoad"
                      :draggable="false"
                      alt="权限说明图片">
                  </li>
                </ul>
              </div>
            </div>
          </cc-poptip>
        </div>
      </li>
    </ul>
    <div class="cc-dialog_footer">
      <span class="c-btn c-btn-default" @click="handleCancel">重新检测</span>
      <span class="c-btn c-btn-primary" @click="handleConfirm">进入会议</span>
    </div>
  </div>
</template>

<script>
import ccPoptip from '../../components/common/poptip/index.vue';
import {validatePosition, getSystemOS} from '../../utils/utils';
import cameraWin1 from '../../assets/images/helpImgs/caemra_win_01.png';
import cameraWin2 from '../../assets/images/helpImgs/camera_win_02.png';
import cameraWin3 from '../../assets/images/helpImgs/camera_win_03.png';
import cameraWin4 from '../../assets/images/helpImgs/camera_win_04.png';
import cameraMac1 from '../../assets/images/helpImgs/camera_mac_01.png';
import microphoneMac1 from '../../assets/images/helpImgs/microphone_mac_01.png';
import microphoneWin1 from '../../assets/images/helpImgs/microphone_win_01.png';
import microphoneWin2 from '../../assets/images/helpImgs/microphone_win_02.png';
import microphoneWin3 from '../../assets/images/helpImgs/microphone_win_03.png';
import microphoneWin4 from '../../assets/images/helpImgs/microphone_win_04.png';
import screenMac1 from '../../assets/images/helpImgs/screen_mac_01.png';
import screenWin1 from '../../assets/images/helpImgs/screen_win_01.png';


export default {
  name: 'rtc-device-result',
  // components
  components: {ccPoptip},
  // props
  props: {
    icons: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      // name
      name: 'rtc-device-result',
      list: [],
      solution: {
        camera: '1.请确认摄像头已正确连接并开启\n2.请确认已开启浏览器及网页访问摄像头设备的权限\n3.确认摄像头没有被其他软件（如：QQ、微信）占用\n4.如果是外置摄像头，请拔出重新插入尝试\n5.重启您的电脑',
        microphone: '1.请确认麦克风已正确连接并开启（麦克风插孔通常是粉红色）\n2.请确认已开启浏览器及网页访问麦克风设备的权限\n3.如果是外置麦克风，请拔出重新插入尝试\n4.重启您的电脑',
        voice: '1.请确认扬声器已正确连接并开启\n2.如果是外置扬声器，请拔出重新插入尝试\n3.重启您的电脑',
        network: '1.请确认网络已正确连接\n2.如果使用的是WIFI，请插入网线尝试有线网络\n3.重启您的电脑',
      },
      cameraWin: {
        id: 'win',
        title: 'windows',
        content: [
          {title: '请检查浏览器【摄像头】权限是否开启'},
          {
            title: '第一步：打开【设置】 > 点击【搜索】 > 输入【相机】 > 点击【相机隐私设置】',
            imgs: [cameraWin1],
          },
          {
            title: '第二步：打开【桌面应用web查看器】的开关> 打开【允许桌面应用访问你的相机】的开关',
            imgs: [cameraWin2],
          },
          {
            title: '第三步：点击浏览器地址栏右侧【摄像头】图标 > 选择【始终允许】',
            imgs: [cameraWin3],
          },
          {
            title: '第四步：点击浏览器地址栏左侧【权限】图标 > 打开【摄像头权限】',
            imgs: [cameraWin4],
          },
          {title: '第五步：关闭 Chrome 浏览器'},
          {title: '第六步：重新打开 Chrome 浏览器'},
        ],
      },
      cameraMac: {
        id: 'mac',
        title: 'Mac',
        content: [
          {title: '请检查浏览器【摄像头】权限是否开启'},
          {
            title: '第一步：打开【系统偏好设置】 > 点击【安全性与隐私】 > 点击【隐私】 > 点击【摄像头】 > 打开 Chrome 摄像头授权',
            imgs: [cameraMac1],
          },
          {
            title: '第二步：点击浏览器地址栏右侧【摄像头】图标 > 选择【始终允许】',
            imgs: [cameraWin3],
          },
          {
            title: '第三步：点击浏览器地址栏左侧【权限】图标 > 打开【摄像头权限】',
            imgs: [cameraWin4],
          },
          {title: '第四步：关闭 Chrome 浏览器'},
          {title: '第五步：重新打开 Chrome 浏览器'},
        ],
      },
      microphoneWin:  {
        id: 'win',
        title: 'windows',
        content: [
          {title: '请检查浏览器【麦克风】权限是否开启'},
          {
            title: '第一步：打开【设置】 > 点击【搜索】 > 输入【麦克风】 > 点击【麦克风隐私设置】',
            imgs: [microphoneWin1],
          },
          {
            title: '第二步：打开【允许桌面应用访问你的麦克风】的开关',
            imgs: [microphoneWin2],
          },
          {
            title: '第三步：点击浏览器地址栏右侧【麦克风】图标 > 选择【始终允许】',
            imgs: [microphoneWin3],
          },
          {
            title: '第四步：点击浏览器地址栏左侧【权限】图标 > 打开【麦克风权限】',
            imgs: [microphoneWin4],
          },
          {title: '第五步：关闭 Chrome 浏览器'},
          {title: '第六步：重新打开 Chrome 浏览器'},
        ],
      },
      microphoneMac:  {
        id: 'mac',
        title: 'Mac',
        content: [
          {title: '请检查浏览器【麦克风】权限是否开启'},
          {
            title: '第一步：打开【系统偏好设置】 > 点击【安全性与隐私】 > 点击【隐私】 > 点击【麦克风】 > 打开 Chrome 麦克风授权',
            imgs: [microphoneMac1],
          },
          {
            title: '第二步：点击浏览器地址栏右侧【摄像头】图标 > 选择【始终允许】',
            imgs: [microphoneWin3],
          },
          {
            title: '第三步：点击浏览器地址栏左侧【权限】图标 > 打开【麦克风权限】',
            imgs: [microphoneWin4],
          },
          {title: '第四步：关闭 Chrome 浏览器'},
          {title: '第五步：重新打开 Chrome 浏览器'},
        ],
      },
      screenShareWin:  {
        id: 'win',
        title: 'windows',
        content: [
          {
            title: '请在浏览器弹窗中选择【要分享的屏幕】，然后点击【分享】按钮。',
            imgs: [screenWin1],
          },
        ],
      },
      screenShareMac:  {
        id: 'mac',
        title: 'Mac',
        content: [
          {title: '请检查浏览器【屏幕录制】权限是否开启'},
          {
            title: '第一步：打开【系统偏好设置】 > 点击【安全性与隐私】 > 点击【隐私】 > 点击【屏幕录制】',
            imgs: [screenMac1],
          },
          {title: '第二步：关闭 Chrome 屏幕录制授权'},
          {title: '第三步：重新打开 Chrome 屏幕录制授权'},
          {title: '第四步：关闭 Chrome 浏览器'},
          {title: '第五步：重新打开 Chrome 浏览器'},
        ],
      },
      helpWidth: 'auto',
    };
  },
  // computed
  computed: {
    helpData() {
      const isMac = getSystemOS().os === 'Mac';
      const camera = isMac ? [this.cameraMac, this.cameraWin] : [this.cameraWin, this.cameraMac];
      const microphone = isMac ? [this.microphoneMac, this.microphoneWin] : [this.microphoneWin, this.microphoneMac];
      const screenShare = isMac ? [this.screenShareMac, this.screenShareWin] : [this.screenShareWin, this.screenShareMac];
      return {
        camera,
        microphone,
        screenShare,
      };
    },
  },
  // watch
  watch: {},
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
      this.list = this.icons.slice(0, this.icons.length - 1);
    },

    /**
     * 取消操作
     * @return {void}
     */
    handleCancel() {
      this.$emit('cancel');
    },

    /**
     * 确认操作
     * @return {void}
     */
    handleConfirm() {
      this.$emit('confirm');
    },

    toQA(e) {
      const gap = 16;
      const maxWidth = 800;
      const calcWidth = e.target.getBoundingClientRect().left - gap;
      this.helpWidth = `${Math.min(maxWidth, calcWidth)}px`;
    },
    scrollToId() {
      this.$nextTick(() => {
        if (this.$route.query.id) {
          const id = this.$route.query.id.toLowerCase();
          const wrap = this.$refs.refWrap;
          wrap.scrollTop = validatePosition(wrap, `#${id}`, 0);
        }
      });
    },
    handleImgLoad() {
      this.scrollToId();
    },
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-result {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  .device-list {
    margin: 0 auto 20px;
    width: 418px;
    line-height: 38px;
    font-size: 14px;
    .device-list__header {
      display: flex;
      height: 38px;
      background: rgba(255,255,255,0.12);
    }

    .device-list__item {
      display: flex;
      height: 39px;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      border-left: 1px solid rgba(255,255,255,0.12);
      border-right: 1px solid rgba(255,255,255,0.12);
    }

    .l-left {
      width: 50%;
      text-align: center;
    }

    .l-right {
      width: 50%;
    }

    .device-list-status {
      position: relative;
      padding-left: 14px;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 7px;
        transform: translate(-50%, -50%);
        width: 4px;
        height: 4px;
        border-radius: 100%;
      }
      &.status-1::before {
        background-color: @colorSuccess;
      }

      &.status-2::before {
        background-color: @colorError;
      }
    }

    .o-link {
      margin-left: 14px;
    }
  }
}
</style>
