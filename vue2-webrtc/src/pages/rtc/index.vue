<template>
  <div class="rtc-wrap">
    <div class="model" v-if="!isPreData">
      <input type="text" placeholder="sdkAppid" v-model="baseInfo.sdkAppid" @keydown.enter="judgeEnterRoom">
      <input type="text" placeholder="secretkey" v-model="baseInfo.secretkey" @keydown.enter="judgeEnterRoom">
      <input type="text" placeholder="房间号" v-model="baseInfo.roomId" @keydown.enter="judgeEnterRoom">
      <input type="text" placeholder="userId" v-model="baseInfo.userId" @keydown.enter="judgeEnterRoom">
      <button @click="judgeEnterRoom">进入房间</button>
    </div>
    <ccRtc
      v-else
      ref="refRtc"
      :settingOperaList="settingOperaList"
      :showDeviceDetectionBtn="showDeviceDetectionBtn"
      :showSettingBtn="showSettingBtn"
      :showScreenShareBtn="showScreenShareBtn"
      :showMicBtn="showMicBtn"
      :showCameraBtn="showCameraBtn"
      :showVoiceBtn="showVoiceBtn"
      :showNetworkBtn="showNetworkBtn"
      :extendJoinUserFn="extendJoinUserFn"
      :extendLeaveUserFn="extendLeaveUserFn"
      @mainRectChange="setMainRect"
      @ready="rtcReady"
      @error="rtcError"
      @change_device="rtcChangeDevice"
      @change_device_id="rtcChangeDeviceId"
      @user_tip_message="rtcTip"
      @sdk_error="rtcError">
      <template #contentUserTagCenter="{user}">
        <span v-text="user.userId"></span>
      </template>
      <template #footerRight>
        <button class="" @click="startLive">开始直播</button>
        <button class="" @click="exitRoom">退出会议</button>
      </template>
    </ccRtc>
  </div>
</template>

<script>
// import dataTable from './dataTable';
// import {getApiMeeting, getApiRight, getApiConferenceConfig, getApiSignature} from './apis/api_extend';
import ccRtc, {calcGrid} from '../../components/rtc/enter';
import {getBasicInfo} from '../../components/rtc/config/basic-info-config';

export default {
  name: 'page-rtc',
  // components
  components: {ccRtc},
  // props
  props: {},
  data() {
    return {
      // name
      name: 'page-rtc',
      baseInfo: {
        sdkAppid: 0,
        secretkey: '',
        name: 'haozg的测试会议',
        roomId: '666666',
        userId: '',
        userName: '',
        userSig: '',
      },
      userAuth: null,
      conferenceConfig: null,
      isPreData: false,
      isRtcReady: false,
      // props start
      settingOperaList: [
        {
          id: 'voice',
          name: '扬声器',
          component: 'settingVoice',
          ref: 'refVoice',
        },
        {
          id: 'microphone',
          name: '麦克风',
          component: 'settingMic',
          ref: 'refMic',
        },
        {
          id: 'camera',
          name: '摄像头',
          component: 'settingCamera',
          ref: 'refCamera',
        },
        {
          id: 'network',
          name: '网络检测',
          component: 'settingNetwork',
          ref: 'refNetwork',
        },
        // {
        //   id: 'elInput',
        //   name: '测试',
        //   component: 'el-input',
        //   ref: 'refElInput',
        // },
      ],
      showDeviceDetectionBtn: true,
      showSettingBtn: true,
      showScreenShareBtn: true,
      showMicBtn: true,
      showCameraBtn: true,
      showVoiceBtn: true,
      showNetworkBtn: true,
      // props end
      mainRect: {},
    };
  },
  // computed
  computed: {},
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
    async init() {
      this.presetBaseInfo();
      // 测试相关按钮会不会隐藏
      // setTimeout(() => {
      //   this.showScreenShareBtn = false;
      //   this.showMicBtn = false;
      //   this.showCameraBtn = false;
      // }, 5000);
      // // 获取会议信息
      // const [meetingData, meetingErr] = await getApiMeeting();
      // console.log('meetingData', meetingData);
      // if (meetingErr) {
      //   alert(meetingErr.msg ? meetingErr.msg : '获取会议数据失败');
      //   return;
      // }
      // this.baseInfo = {...this.baseInfo, ...meetingData};
      // if (meetingData.serviceProvider !== 'TENCENT') {
      //   alert(`该会议暂不支持${meetingData.serviceProvider}直播运行商，请联系主持人`);
      //   return;
      // }
      // if (this.baseInfo.status === dataTable.liveStatusNumber.FINISHED) {
      //   // 会议已结束
      //   // this.$message.error('会议已结束');
      //   alert('会议已结束');
      //   return;
      // }
      // // 获取权限
      // const [userAuthData, userAuthErr] = await getApiRight({roomId: this.baseInfo.roomId});
      // if (userAuthErr) {
      //   alert(userAuthData?.msg || '获取权限失败，请重试');
      //   return;
      // }
      // this.userAuth = userAuthData;
      // // 加载互动会议室配置信息
      // const [conferenceConfigData] = await getApiConferenceConfig({roomId: this.baseInfo.roomId});
      // if (conferenceConfigData) {
      //   this.setConferenceConfig(conferenceConfigData, 'init');
      // }
      // // 获取加入房间的token --- 七牛/腾讯的token
      // const [userSigData, userSigErr] = await getApiSignature({
      //   attendeeId: this.baseInfo.userId,
      //   roomId: this.baseInfo.roomId,
      //   siteType: dataTable.siteType.pc,
      // });
      // if (userSigErr) {
      //   alert(userSigData?.msg || '获取不到第三方SDK token');
      //   return;
      // }
      // this.baseInfo.userSig = userSigData;
      // this.isPreData = true;
      // this.judgeEnterRoom();
    },

    presetBaseInfo() {
      const query = this.$route.query;
      const baseInfo = this.$options.data().baseInfo;
      this.baseInfo.roomId = query.roomId || baseInfo.roomId;
      this.baseInfo.userId = query.userId || baseInfo.userId;
      this.baseInfo.sdkAppid = Number(query.id || baseInfo.sdkAppid);
      this.baseInfo.secretkey = query.key || baseInfo.secretkey;
    },

    judgeEnterRoom() {
      if (this.baseInfo.roomId && this.baseInfo.userId && this.baseInfo.sdkAppid && this.baseInfo.secretkey) {
        const basicInfo = getBasicInfo(this.baseInfo.sdkAppid, this.baseInfo.secretkey, this.baseInfo.userId);
        this.baseInfo = {...this.baseInfo, ...basicInfo};
        this.isPreData = true;
      }
    },

    rtcReady(err) {
      // err无值为正常，err有值，则为获取音视频设备授权出了问题。
      // 有error仍然可以加入房间，可以接收音视频，却不能打开相机或者麦克风
      console.log('rtcReady', err);
      this.isRtcReady = true;
      // this.judgeEnterRoom();
      this.$refs.refRtc.enterRoom({
        sdkAppId: this.baseInfo.sdkAppId,
        userSig: this.baseInfo.userSig,
        roomId: this.baseInfo.roomId,
        userId: this.baseInfo.userId,
        roomName: this.baseInfo.name,
        enableMic: true,
        enableCamera: true,
      }).then(enterErr => {
        if (enterErr) {
          console.error('enterRoom error: ', err);
        } else {
          this.$router.replace({
            path: this.$route.path,
            query: {
              id: this.baseInfo.sdkAppid,
              key: this.baseInfo.secretkey,
              roomId: this.baseInfo.roomId,
              userId: this.baseInfo.userId,
            },
          }).catch(e => e);
          console.log('成功加入房间');
        }
      });
    },

    exitRoom() {
      this.$refs.refRtc.exitRoom().then(err => {
        if (err) {
          console.error('exitRoom error: ', err);
        } else {
          console.log('成功退出房间');
          this.$nextTick(() => {
            this.isPreData = false;
          });
        }
      });
    },

    rtcChangeDevice(deviceData) {
      console.log('rtcChangeDevice', deviceData);
    },

    rtcChangeDeviceId(deviceType, device) {
      console.log('rtcChangeDeviceId', deviceType, device);
      let msg = '';
      switch (deviceType) {
        case 'camera':
          msg = `摄像头已切换至【${device.label}】`;
          break;
        case 'microphone':
          msg = `麦克风已切换至【${device.label}】`;
          break;
        case 'voice':
          msg = `扬声器已切换至【${device.label}】`;
          break;
        default:
          break;
      }
      msg && this.$message && this.$message.success(msg);
    },

    rtcError(error) {
      console.error('rtcError', error);
      // console.error('rtcError code', error.code);
      // console.error('rtcError message', error.message);
      // console.error('rtcError data', error.data);
    },

    setConferenceConfig(data) {
      // eslint-disable-next-line no-magic-numbers
      data.interFlow = data && data.streamConfig && typeof data.streamConfig.level !== 'undefined' ? data.streamConfig.level : 2;
      // this.handleCamerasChange(data);
      this.conferenceConfig = data;
    },

    setMainRect({rect, users}) {
      this.mainRect = rect;
      calcGrid.calcGrid1(users, this.mainRect);
    },

    extendJoinUserFn({user, users}) {
      return new Promise(resolve => {
        calcGrid.calcGrid1(users, this.mainRect);
        resolve({...user, ...{userName: '瑞雯', tagName: '瑞雯'}});
        // setTimeout(() => {
        //   console.log('3s了');
        //   calcGrid.calcGrid1(users, this.mainRect);
        //   resolve({...user, ...{userName: '瑞雯', tagName: '瑞雯', isLocal: true}});
        //   // eslint-disable-next-line no-magic-numbers
        // }, 3000);
      });
    },

    extendLeaveUserFn({user, users}) {
      calcGrid.calcGrid1(users, this.mainRect);
      console.log('extendLeaveUserFn', {user, users});
    },

    rtcTip({message}) {
      message && this.$message && this.$message.warn(message);
    },

    startLive() {
      //
    },
  },
};
</script>

<style lang="less">
html, body {
  height: 100%;
}

body {
  min-width: 1000px;
  min-height: 560px;
  overflow: auto;
  line-height: 1;
}
.rtc-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.model {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;

  input,
  button {
    padding: 0 8px;
    width: 100%;
    line-height: 34px;
    height: 34px;
  }

  button {
    max-width: 100px;
  }
}
</style>
