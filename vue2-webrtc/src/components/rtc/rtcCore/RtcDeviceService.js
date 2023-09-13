import RtcDeviceCamera from './RtcDeviceCamera';
import RtcDeviceMic from './RtcDeviceMic';
import RtcDeviceVoice from './RtcDeviceVoice';
import RtcDeviceNetwork from './RtcDeviceNetwork';
import {debounce, getVoiceVolume, getMicrophoneVolume, getOS, getBrowser, deepCopy} from '../utils/utils';
import emitter, {RtcDeviceServiceEvents} from '../common/emitter/event';
import logger from '../common/logger/index';
import {RoomErrorCode, RoomErrorMessage, StorageKeys} from '../constants/constant';

const micMediaRecorderStartTime = 10;
const micMediaRecorderIntervalTime = 6;

const logPrefix = '[RtcDeviceService]';

class RtcDeviceService {
  state = null;
  rtcCloudService = null;

  // safari和firefox浏览器上检测不到扬声器设备
  noVoiceDevice = true;

  createLocalStreamLoading = false;
  cameraLocalStream = null;
  microphoneLocalStream = null;

  // 录制相关
  micStream = null;
  micMediaRecorder = null;
  micMediaRecorderStartTime = micMediaRecorderStartTime;
  micMediaRecorderIntervalTime = micMediaRecorderIntervalTime;
  micMediaRecorderIntervalTimer = null;
  micRecordedBlobs = [];
  audioContext = null;
  audioSource = null;
  gainNode = null;
  analyserNode = null;

  constructor(state, rtcCloudService) {
    this.state = state;
    this.rtcCloudService = rtcCloudService;
    this.state.camera = new RtcDeviceCamera();
    this.state.microphone = new RtcDeviceMic();
    this.state.voice = new RtcDeviceVoice();
    this.state.network = new RtcDeviceNetwork();
  }

  init() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      // 检测扬声器设备 safari和firefox浏览器上检测不到扬声器设备
      this.noVoiceDevice = this.judgeVoiceDevice();
      this.bindMediaDevicesEvent();
      this.reset();
      await this.getDevicesInfo();
      if (!this.state.camera.has && !this.state.microphone.has) {
        logger.warn(`${logPrefix}.init message: ${RoomErrorMessage.NOT_FOUND_DEVICE_ERROR} data:`, this.state.camera, this.state.microphone);
        const errorParams = {
          code: RoomErrorCode.NOT_FOUND_DEVICE_ERROR,
          message: RoomErrorMessage.NOT_FOUND_DEVICE_ERROR,
          data: {
            camera: this.state.camera,
            mic: this.state.microphone,
          },
        };
        emitter.emit(RtcDeviceServiceEvents.NOT_FOUND_DEVICE_ERROR, errorParams);
        return resolve(errorParams);
      }
      this.requestCameraOrMicrophone().then(() => {
        // 获取设备信息
        this.getDevicesInfo();
        resolve(null);
      })
        .catch(err => {
          logger.error(`${logPrefix}.requestCameraOrMicrophone`, err);
          // 获取设备信息
          this.getDevicesInfo();
          const errorParams = {
            code: RoomErrorCode.CAMERA_MIC_USER_DENY,
            message: RoomErrorMessage.CAMERA_MIC_USER_DENY,
            data: err,
          };
          emitter.emit(RtcDeviceServiceEvents.CAMERA_MIC_USER_DENY, errorParams);
          resolve(errorParams);
        });
    });
  }

  reset() {
    const cameraAuth = this.state.camera ? this.state.camera.hasAuth : false;
    const cameraErrorCode = this.state.camera ? this.state.camera.errorCode : '';
    const cameraErrorText = this.state.camera ? this.state.camera.errorText : '';
    const microphoneAuth = this.state.microphone ? this.state.microphone.hasAuth : false;
    const microphoneErrorCode = this.state.microphone ? this.state.microphone.errorCode : '';
    const microphoneErrorText = this.state.microphone ? this.state.microphone.errorText : '';
    // safari和firefox浏览器上检测不到扬声器设备
    this.noVoiceDevice = this.judgeVoiceDevice();
    // 摄像头信息
    this.state.camera = new RtcDeviceCamera();
    this.state.camera.hasAuth = cameraAuth;
    this.state.camera.errorCode = cameraErrorCode;
    this.state.camera.errorText = cameraErrorText;
    // 麦克风信息
    this.state.microphone = new RtcDeviceMic();
    this.state.microphone.hasAuth = microphoneAuth;
    this.state.microphone.errorCode = microphoneErrorCode;
    this.state.microphone.errorText = microphoneErrorText;
    // 扬声器信息
    this.state.voice = new RtcDeviceVoice();
    // 创建本地媒体流loading标识
    this.createLocalStreamLoading = false;
    // 销毁流
    this.releaseStream('cameraLocalStream');
    this.releaseStream('microphoneLocalStream');
    // 检测扬声器设备 safari和firefox浏览器上检测不到扬声器设备
    this.noVoiceDevice = this.judgeVoiceDevice();
  }

  bindMediaDevicesEvent() {
    const delay = 500;
    navigator.mediaDevices.addEventListener('devicechange', debounce(this.handleDeviceChange, delay, this));
  }

  handleDeviceChange(that) {
    logger.log(`${logPrefix}.handleDeviceChange`, that);
    // 保存旧数据
    const oldCameraConnect = that.state.camera.connect;
    const oldMicrophoneConnect = that.state.microphone.connect;
    const oldVoiceConnect = that.state.voice.connect;
    const oldNetworkConnect = that.state.network.connect;
    const deviceData = {
      camera: {oldDeviceList: deepCopy(that.state.camera.deviceList)},
      microphone: {oldDeviceList: deepCopy(that.state.microphone.deviceList)},
      voice: {oldDeviceList: deepCopy(that.state.voice.deviceList)},
    };
    // 获取设备信息
    that.getDevicesInfo().then(() => {
      // that.setDefinitionList();
      const errorDevice = [];
      // 摄像头有问题
      if (!that.state.camera.connect && that.state.camera.connect !== oldCameraConnect) {
        errorDevice.push('camera');
      }
      // 麦克风有问题
      if (!that.state.microphone.connect && that.state.microphone.connect !== oldMicrophoneConnect) {
        errorDevice.push('microphone');
      }
      // 扬声器有问题
      if (!that.state.voice.connect && that.state.voice.connect !== oldVoiceConnect) {
        errorDevice.push('voice');
      }
      // 网络有问题
      if (!that.state.network.connect && that.state.network.connect !== oldNetworkConnect) {
        errorDevice.push('network');
      }
      if (errorDevice.length) {
        emitter.emit(RtcDeviceServiceEvents.DEVICE_ERROR, errorDevice);
      }
      deviceData.camera.deviceList = that.state.camera.deviceList;
      deviceData.microphone.deviceList = that.state.microphone.deviceList;
      deviceData.voice.deviceList = that.state.voice.deviceList;
      emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE, deviceData);
    });
  }

  async getDevicesInfo() {
    await this.getCameraDevicesInfo();
    await this.getMicrophoneDevicesInfo();
    await this.getVoiceDevicesInfo();
  }

  async getCameraDevicesInfo() {
    const cameraList = await this.getCameras();
    this.state.camera.has = cameraList.length > 0;
    cameraList.forEach(camera => {
      if (camera.deviceId.length > 0) {
        this.state.camera.connect = true;
      }
    });
    this.state.camera.deviceList = cameraList || [];
    if (!this.state.camera.has) {
      this.state.camera.connect = false;
      this.state.camera.hasAuth = false;
      this.state.camera.device = null;
      this.state.camera.deviceId = '';
      this.state.camera.status = false;
      window.localStorage.setItem(StorageKeys.cameraId, '');
      // 销毁流
      this.releaseStream('cameraLocalStream');
    } else {
      this.state.camera.device = this.state.camera.deviceList[0];
      const deviceId = this.state.camera.device ? this.state.camera.device.deviceId : '';
      this.state.camera.deviceId = deviceId;
      window.localStorage.setItem(StorageKeys.cameraId, deviceId);
    }
  }

  async getMicrophoneDevicesInfo() {
    const micList = await this.getMicrophones();
    this.state.microphone.has = micList.length > 0;
    micList.forEach(mic => {
      if (mic.deviceId.length > 0) {
        this.state.microphone.connect = true;
      }
    });
    this.state.microphone.deviceList = micList || [];
    if (!this.state.microphone.has) {
      this.state.microphone.connect = false;
      this.state.microphone.hasAuth = false;
      this.state.microphone.device = null;
      this.state.microphone.deviceId = '';
      this.state.microphone.status = false;
      this.state.microphone.volume = 0;
      window.localStorage.setItem(StorageKeys.microphoneId, '');
      // 销毁流
      this.releaseStream('microphoneLocalStream');
    } else {
      this.state.microphone.device = this.state.microphone.deviceList[0];
      const deviceId = this.state.microphone.device ? this.state.microphone.device.deviceId : '';
      this.state.microphone.deviceId = deviceId;
      window.localStorage.setItem(StorageKeys.microphoneId, deviceId);
    }
  }

  async getVoiceDevicesInfo() {
    const voiceList = await this.getSpeakers();
    this.state.voice.has = voiceList.length > 0;
    // 如果是无法进行扬声器检测的浏览器，设置为true
    if (this.noVoiceDevice) {
      this.state.voice.has = true;
      this.state.voice.connect = true;
    } else {
      this.state.voice.connect = voiceList.length > 0;
    }
    this.state.voice.deviceList = voiceList || [];
    if (!this.state.voice.has) {
      this.state.voice.connect = false;
      this.state.voice.device = null;
      this.state.voice.deviceId = '';
      this.state.voice.status = false;
      this.state.voice.volume = 0;
      window.localStorage.setItem(StorageKeys.voiceId, '');
    } else {
      this.state.voice.device = this.state.voice.deviceList[0];
      const deviceId = this.state.voice.device ? this.state.voice.device.deviceId : '';
      this.state.voice.deviceId = deviceId;
      window.localStorage.setItem(StorageKeys.voiceId, deviceId);
    }
  }

  // 唤起请求摄像头或麦克风弹窗
  requestCameraOrMicrophone() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: this.state.camera.has,
          audio: this.state.microphone.has,
        })
        .then(() => {
          if (this.state.camera.has) {
            this.state.camera.connect = true;
          }
          if (this.state.microphone.has) {
            this.state.microphone.connect = true;
          }
          this.state.camera.hasAuth = true;
          this.state.camera.errorCode = '';
          this.state.camera.errorText = '';
          this.state.microphone.hasAuth = true;
          this.state.microphone.errorCode = '';
          this.state.microphone.errorText = '';
          resolve();
        })
        .catch(err => {
          // 处理getUserMedia的错误
          this.handleGetUserMediaError(err);
          reject(err);
        });
    });
  }

  handleGetUserMediaError(error) {
    let code = '';
    let codeText = '';
    let type = '';
    console.log('111111111', error, error.name);
    switch (error.name) {
      case 'NotReadableError':
        code = 'NotReadableError';
        codeText = '暂时无法访问摄像头/麦克风，请确保系统授予当前浏览器摄像头/麦克风权限，并且没有其他应用占用摄像头/麦克风';
        if (error.message === 'Could not start video source' || error.message === 'Failed to allocate videosource') {
          type = 'video';
        }
        // 当系统或浏览器异常的时候，可能会出现此错误，您可能需要引导用户重启电脑/浏览器来尝试恢复。
        break;
        // eslint-disable-next-line no-case-declarations
      case 'NotAllowedError':
        code = 'NotAllowedError';
        codeText = '用户/系统已拒绝授权访问摄像头或麦克风';
        break;
      case 'NotFoundError':
        code = 'NotFoundError';
        codeText = '未检测到摄像头或麦克风设备';
        break;
      case 'OverConstrainedError':
        code = 'OverConstrainedError';
        codeText = '采集属性设置错误，如果您指定了 cameraId/microphoneId，请确保它们是一个有效的非空字符串';
        break;
      default:
        logger.warn(`${logPrefix} 初始化本地流时遇到未知错误, 请重试`);
        break;
    }
    if (this.state.camera.has) {
      this.state.camera.connect = false;
      this.state.camera.hasAuth = false;
      this.state.camera.errorCode = code;
      this.state.camera.errorText = codeText;
    }
    if (this.state.microphone.has && !type) {
      this.state.microphone.connect = false;
      this.state.microphone.hasAuth = false;
      this.state.microphone.errorCode = code;
      this.state.microphone.errorText = codeText;
    } else {
      this.state.microphone.connect = true;
      this.state.microphone.hasAuth = true;
      this.state.microphone.errorCode = '';
      this.state.microphone.errorText = '';
    }
  }

  // safari和firefox浏览器上检测不到扬声器设备
  judgeVoiceDevice() {
    // 判断是否为safari浏览器
    const isSafari =
        (/Safari/).test(navigator.userAgent) &&
        !(/Chrome/).test(navigator.userAgent) &&
        !(/CriOS/).test(navigator.userAgent) &&
        !(/FxiOS/).test(navigator.userAgent) &&
        !(/EdgiOS/).test(navigator.userAgent);
    const isFirefox = (/Firefox/i).test(navigator.userAgent);
    // safari和firefox浏览器上检测不到扬声器设备
    return isSafari || isFirefox;
  }

  filterArrayByKey(list, key) {
    const result = [];
    list.forEach(i => {
      const targetIndex = result.findIndex(j => j[key] === i[key]);
      if (targetIndex > -1) {
        result.splice(targetIndex, 1, i);
      } else {
        result.push(i);
      }
    });
    return result;
  }

  async getCameras() {
    const list = await navigator.mediaDevices.enumerateDevices();
    let retList = [];
    if (list) {
      list.forEach(device => {
        let newDevice = device;
        if (device.kind === 'videoinput') {
          try {
            newDevice = device.toJSON();
          } catch (e) {
            logger.error(`${logPrefix}.getCameras e`, e);
          }
          // newDevice = [
          //   {deviceId:'1', groupId:'1', kind:'videoinput', label:'还哦的坏收到货爱上丢收到货暗示对阿萨德哈usID阿萨德还哦的坏收到货爱上丢收到货暗示对阿萨德哈usID阿萨德'},
          //   {deviceId:'2', groupId:'2', kind:'videoinput', label:'asdadsadadasdasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdadsadadasdasdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'},
          //   {deviceId:'3', groupId:'3', kind:'videoinput', label:'3'},
          //   {deviceId:'4', groupId:'4', kind:'videoinput', label:'4'},
          //   {deviceId:'5', groupId:'5', kind:'videoinput', label:'5'},
          //   {deviceId:'6', groupId:'6', kind:'videoinput', label:'6'},
          //   {deviceId:'7', groupId:'7', kind:'videoinput', label:'7'},
          //   {deviceId:'8', groupId:'8', kind:'videoinput', label:'8'},
          //   {deviceId:'9', groupId:'9', kind:'videoinput', label:'9'},
          //   {deviceId:'10', groupId:'10', kind:'videoinput', label:'10'},
          //   {deviceId:'11', groupId:'11', kind:'videoinput', label:'11'},
          //   {deviceId:'12', groupId:'12', kind:'videoinput', label:'12'},
          //   {deviceId:'13', groupId:'13', kind:'videoinput', label:'13'},
          //   {deviceId:'14', groupId:'14', kind:'videoinput', label:'14'},
          //   {deviceId:'15', groupId:'15', kind:'videoinput', label:'15'},
          //   {deviceId:'16', groupId:'16', kind:'videoinput', label:'16'},
          //   {deviceId:'17', groupId:'17', kind:'videoinput', label:'17'},
          //   {deviceId:'18', groupId:'18', kind:'videoinput', label:'18'},
          //   {deviceId:'19', groupId:'19', kind:'videoinput', label:'19'},
          //   {deviceId:'20', groupId:'20', kind:'videoinput', label:'20'}
          // ];
          retList.push(newDevice);
        }
      });
    }
    // 相同的groupId保留一个
    retList = this.filterArrayByKey(retList, 'groupId');
    return retList || [];
  }

  async getMicrophones() {
    const list = await navigator.mediaDevices.enumerateDevices();
    let retList = [];
    if (list) {
      list.forEach(device => {
        let newDevice = device;
        if (device.kind === 'audioinput') {
          try {
            newDevice = device.toJSON();
          } catch (e) {
            logger.error(`${logPrefix}.getMicrophones e`, e);
          }
          retList.push(newDevice);
        }
      });
    }
    retList = retList.filter(i => i.label.indexOf('立体声混音') === -1);
    // 相同的groupId保留一个
    retList = this.filterArrayByKey(retList, 'groupId');
    return retList || [];
  }

  async getSpeakers() {
    const list = await navigator.mediaDevices.enumerateDevices();
    let retList = [];
    if (list) {
      list.forEach(device => {
        let newDevice = device;
        if (device.kind === 'audiooutput') {
          if (device.deviceId) {
            try {
              newDevice = device.toJSON();
            } catch (e) {
              logger.error(`${logPrefix}.getSpeakers e`, e);
            }
            retList.push(newDevice);
          }
        }
      });
    }
    // 相同的groupId保留一个
    retList = this.filterArrayByKey(retList, 'groupId');
    return retList || [];
  }

  /**
   * 开始摄像头检测
   * @param {Object} data 数据
   * @return {Promise<void>} promise
   */
  async startCameraTesting(data) {
    this.createLocalStreamLoading = true;
    await this.getCameraDevicesInfo().then(async () => {
      if (this.state.camera.has) {
        await this.cameraTestingSuccess(data);
      }
    });
  }

  /**
   * 摄像头链接成功后的执行函数
   * @param {Object} data 其他数据 比如摄像头的配置信息分辨率等
   * @return {void}
   */
  async cameraTestingSuccess(data) {
    const device = this.state.camera.deviceList.find(i => i.deviceId === window.localStorage.getItem(StorageKeys.cameraId));
    this.state.camera.device = device || this.state.camera.deviceList[0];
    const deviceId = this.state.camera.device ? this.state.camera.device.deviceId : '';
    this.state.camera.deviceId = deviceId;
    window.localStorage.setItem(StorageKeys.cameraId, deviceId);
    // 创建本地视频流
    await this.createLocalStream('camera', '.c-camera', data);
  }

  /**
   * 设置摄像头检测结果
   * @param {Boolean} flag 成功或失败
   * @return {void}
   */
  setCameraTestingResult(flag) {
    // 未创建完，不允许关闭
    if (this.createLocalStreamLoading) {
      return;
    }
    this.state.camera.status = flag;
    // 销毁流
    this.releaseStream('cameraLocalStream');
  }

  /**
   * 摄像头改变
   * @param {string} deviceId deviceId
   * @param {boolean} exeSuccess exeSuccess
   * @return {Promise<void>} promise
   */
  async changeCamera(deviceId, exeSuccess = true) {
    window.localStorage.setItem(StorageKeys.cameraId, deviceId);
    this.state.camera.deviceId = deviceId;
    const device = this.state.camera.deviceList.find(i => i.deviceId === deviceId);
    emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_ID, {
      deviceType: 'camera',
      device,
    });
    if (exeSuccess) {
      await this.cameraTestingSuccess(this.state.camera.definitionList[this.state.camera.definitionId]);
    }
  }

  /**
   * 开始麦克风检测
   * @return {Promise<void>} promise
   */
  async startMicrophoneTesting() {
    this.createLocalStreamLoading = true;
    await this.getMicrophoneDevicesInfo().then(async () => {
      if (this.state.microphone.has) {
        this.microphoneTestingSuccess();
      }
    });
  }

  /**
   * 麦克风链接成功后的执行函数
   * @return {void}
   */
  async microphoneTestingSuccess() {
    const isAndroid = getOS().type === 'mobile' && getOS().osName === 'Android';
    // 如果是安卓设备，不允许切换麦克风(切换麦克风存在获取不到音量的情况)
    if (isAndroid) {
      this.state.microphone.deviceList = this.state.microphone.deviceList.slice(0, 1);
    }
    const device = this.state.microphone.deviceList.find(i => i.deviceId === window.localStorage.getItem(StorageKeys.microphoneId));
    this.state.microphone.device = device || this.state.microphone.deviceList[0];
    const deviceId = this.state.microphone.device ? this.state.microphone.device.deviceId : '';
    this.state.microphone.deviceId = deviceId;
    window.localStorage.setItem(StorageKeys.microphoneId, deviceId);
    // 创建本地视频流
    await this.createLocalStream('microphone', '.device-microphone-audio').then(() => {
      if (this.microphoneLocalStream) {
        const intervalTime = 100;
        window.clearInterval(this.state.microphone.volumeInterval);
        this.state.microphone.volumeInterval = window.setInterval(() => {
          const e = new Uint8Array(this.analyserNode.frequencyBinCount);
          this.analyserNode.getByteFrequencyData(e);
          /* eslint-disable */
          let t = 0,
              r = e.length;
          e.forEach((i, o) => {
            const s = o * (this.audioContext.sampleRate || 44100) / e.length;
            if (s > 22050) {
              return void (r -= 1);
            }
            const a = this.aWeight(s) * i / 255;
            a <= 0 ? r -= 1 : t += a * a;
          });
          this.state.microphone.volume = r === 0 ? 0 : Math.sqrt(t / r);
        }, intervalTime);
      }
    });
  }

  aWeight(e) {
    const t = e * e;
    return 1.2588966 * 14884e4 * t * t / ((t + 424.36) * Math.sqrt((t + 11599.29) * (t + 544496.41)) * (t + 14884e4));
  }

  /**
   * 设置麦克风音量
   * @param {number} val 音量
   * @return {void}
   */
  setMicrophoneStreamVolume(val) {
    if (this.microphoneLocalStream) {
      const percent = 100;
      this.microphoneLocalStream.setVolume && this.microphoneLocalStream.setVolume(Number(val) / percent);
    }
  }

  /**
   * 麦克风检测结果
   * @param {Boolean} flag 成功或失败
   * @return {void}
   */
  setMicrophoneTestingResult(flag) {
    this.state.microphone.status = flag;
    // 销毁流
    this.releaseStream('microphoneLocalStream');
  }

  /**
   * 麦克风改变
   * @param {string} deviceId deviceId
   * @param {Boolean} exeSuccess exeSuccess
   * @return {Promise<void>} promise
   */
  async changeMicrophone(deviceId, exeSuccess = true) {
    window.localStorage.setItem(StorageKeys.microphoneId, deviceId);
    this.state.microphone.deviceId = deviceId;
    const device = this.state.microphone.deviceList.find(i => i.deviceId === deviceId);
    emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_ID, {
      deviceType: 'microphone',
      device,
    });
    if (exeSuccess) {
      this.microphoneTestingSuccess();
    }
  }

  /**
   * 开始扬声器检测
   * @return {Promise<void>} promise
   */
  async startVoiceTesting() {
    await this.getVoiceDevicesInfo().then(async () => {
      if (this.state.voice.has) {
        const device = this.state.voice.deviceList.find(i => i.deviceId === window.localStorage.getItem(StorageKeys.voiceId));
        this.state.voice.device = device || this.state.voice.deviceList[0];
        const deviceId = this.state.voice.device ? this.state.voice.device.deviceId : '';
        this.state.voice.deviceId = deviceId;
        window.localStorage.setItem(StorageKeys.voiceId, deviceId);
      }
    });
  }

  /**
   * 扬声器检测结果
   * @param {Boolean} flag 成功或失败
   * @return {void}
   */
  setVoiceTestingResult(flag) {
    this.state.voice.status = flag;
  }

  /**
   * 扬声器改变
   * @param {string} deviceId deviceId
   * @return {Promise<void>} promise
   */
  async changeVoice(deviceId) {
    window.localStorage.setItem(StorageKeys.voiceId, deviceId);
    this.state.voice.deviceId = deviceId;
    const device = this.state.voice.deviceList.find(i => i.deviceId === deviceId);
    emitter.emit(RtcDeviceServiceEvents.DEVICE_CHANGE_ID, {
      deviceType: 'voice',
      device,
    });
  }

  /**
   * 创建本地媒体流
   * @param {string} type 类型
   * @param {string} container .calss/#id
   * @param {Object} other 其他数据
   * @return {Promise<void>} premise
   */
  async createLocalStream(type, container, other) {
    if (this.cameraLocalStream) {
      await this.releaseStream('cameraLocalStream');
    }
    if (this.microphoneLocalStream) {
      await this.releaseStream('microphoneLocalStream');
    }
    switch (type) {
      case 'camera':
        await this.createLocalCameraStream(container, other);
        break;
      case 'microphone':
        await this.createLocalMicStream(container);
        break;
      default:
        break;
    }
  }

  // 获取media的方法
  async getMedia(constraints) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      logger.error(`${logPrefix}.getMedia fail:`, err);
      this.handleGetUserMediaError(err);
      return null;
    }
  }

  // 自定义play方法
  customStreamPlay(element, type, stream) {
    return new Promise((resolve, reject) => {
      const targets = element.querySelectorAll(type);
      targets && targets.forEach(v => {
        element.removeChild(v);
      });
      const target = document.createElement(type);
      switch (type) {
        case 'audio':
          target.style.visibility = 'hidden';
          target.className = 'audio-player stream-player';
          break;
        case 'video':
          target.style.width = '100%';
          target.style.height = '100%';
          target.style.objectFit = 'contain';
          target.muted = true;
          target.setAttribute('playsinline', true);
          target.className = 'video-player stream-player';
          break;
        default:
          break;
      }
      target.autoplay = true;
      target.srcObject = stream;
      target.onloadedmetadata = () => {
        target.play()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      };
      element.appendChild(target);
    });
  }

  /**
   * 设置play的播放器音量
   * @param {number} val 音量
   * @param {string} container .calss/#id
   * @return {void}
   */
  setDevicePlayerVolume(val, container = '.device-microphone-audio') {
    const percent = 100;
    const newVolume = Number(val) / percent;
    const containerDom = document.querySelector(container);
    if (containerDom) {
      const players = [...containerDom.querySelectorAll('audio'), ...containerDom.querySelectorAll('video')];
      if (players) {
        players.forEach(player => {
          player.volume = newVolume;
        });
      }
    }
  }

  /**
   * 创建本地摄像头媒体流
   * @param {string} container .calss/#id
   * @param {Object} other 其他数据
   * @return {Promise<void>} premise
   */
  async createLocalCameraStream(container, other) {
    const defaultEncoderConfig = {
      width: 640,
      height: 360,
      // 视频帧率
      frameRate: 20,
      bitrate: 500
    };
    const encoderConfig = other ? other.encoderConfig || defaultEncoderConfig : defaultEncoderConfig;
    const videoConfig = {
      audio: false,
      video: Object.assign({deviceId: window.localStorage.getItem(StorageKeys.cameraId)}, encoderConfig)
    };
    this.cameraLocalStream = await this.getMedia(videoConfig);
    const localStream = this.cameraLocalStream;
    const containerDom = document.querySelector(container);
    if (containerDom && localStream) {
      this.customStreamPlay(containerDom, 'video', localStream).then(() => {
        this.createLocalStreamLoading = false;
        this.setDevicePlayerVolume(getVoiceVolume(), container);
      });
    } else {
      this.createLocalStreamLoading = false;
    }
  }

  /**
   * 创建本地麦克风媒体流
   * @param {string} container .calss/#id
   * @return {Promise<void>} premise
   */
  async createLocalMicStream(container) {
    const audioConfig = {
      audio: {
        deviceId: window.localStorage.getItem(StorageKeys.microphoneId),
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true
      },
      video: false
    };
    this.microphoneLocalStream = await this.getMedia(audioConfig);
    if (this.microphoneLocalStream) {
      const localStream = this.microphoneLocalStream;
      this.audioContext = new AudioContext();
      this.audioSource = this.audioContext.createMediaStreamSource(localStream);
      const audioDestination = this.audioContext.createMediaStreamDestination();
      const percent = 100;
      // 设置音量
      this.gainNode = this.audioContext.createGain();
      this.audioSource.connect(this.gainNode);
      this.gainNode.connect(audioDestination);
      this.gainNode.gain.value = Number(getMicrophoneVolume()) / percent;
      // 获取音量初始化
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.audioSource.connect(this.analyserNode);
      this.micStream = localStream;
      this.micRecordedBlobs = [];
      const options = {'mineType': 'audio/ogg; codecs=opus'};
      this.micMediaRecorder = new MediaRecorder(this.micStream, options);
      // 录制数据回调时间
      this.micMediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.micRecordedBlobs.push(e.data);
        }
      };
      const containerDom = document.querySelector(container);
      if (containerDom) {
        containerDom.src = '';
      }
      this.micMediaRecorder.onstop = () => {
        if (containerDom) {
          let blob = new Blob(this.micRecordedBlobs, {'type': 'audio/ogg; codecs=opus'});
          containerDom.src = window.URL.createObjectURL(blob);
          // eslint-disable-next-line no-magic-numbers
          containerDom.volume = Number(getVoiceVolume()) / percent || 0.5;
          containerDom.title = '测试麦克风.mp3';
          blob = null;
          this.micStream = null;
          this.micMediaRecorder = null;
          this.micRecordedBlobs = [];
        }
      };
      const ms = 1000;
      // 录制
      this.micMediaRecorder.start(this.micMediaRecorderStartTime);
      window.clearInterval(this.micMediaRecorderIntervalTimer);
      this.micMediaRecorderIntervalTimer = window.setInterval(() => {
        this.micMediaRecorderIntervalTime -= 1;
        emitter.emit(RtcDeviceServiceEvents.DEVICE_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE, this.micMediaRecorderIntervalTime);
        if (this.micMediaRecorderIntervalTime === 0) {
          window.clearInterval(this.micMediaRecorderIntervalTimer);
          this.micMediaRecorder.stop();
          this.releaseStream('microphoneLocalStream', false);
        }
      }, ms);
    }
  }

  /**
   * 销毁本地流
   * @param {string} stream 流的key
   * @param {Boolean} resetMicMediaFlag 是否重置麦克风录制相关数据
   * @return {void}
   */
  releaseStream(stream, resetMicMediaFlag = true) {
    if (this[stream]) {
      this[stream].getTracks().forEach(t => {
        t.stop();
      });
      this[stream].close && this[stream].close();
      this[stream] = null;
    }
    if (this.state.microphone.volumeInterval) {
      window.clearInterval(this.state.microphone.volumeInterval);
      this.state.microphone.volumeInterval = null;
    }
    if (resetMicMediaFlag) {
      this.resetMicMedia();
    }
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }
    this.audioContext = null;
  }

  resetMicMedia() {
    window.clearInterval(this.micMediaRecorderIntervalTimer);
    this.micStream = null;
    if (this.micMediaRecorder) {
      if (this.micMediaRecorder.state !== 'inactive') {
        this.micMediaRecorder.onstop = null;
        this.micMediaRecorder.stop();
      }
    }
    this.micMediaRecorderIntervalTime = micMediaRecorderIntervalTime;
    emitter.emit(RtcDeviceServiceEvents.DEVICE_MIC_MEDIA_RECORD_INTERVAL_TIME_CHANGE, this.micMediaRecorderIntervalTime);
    this.micMediaRecorder = null;
    this.micRecordedBlobs = [];
  }

  /**
   * 开始网络检测
   * @return {Promise<void>} promise
   */
  startNetworkTesting() {
    return new Promise(async (resolve, reject) => {
      // 获取系统信息
      this.state.network.OSInfo = getOS();
      // 获取浏览器信息
      this.state.network.browser = getBrowser();
      // 浏览器是否支持
      const result = await this.rtcCloudService.checkSystemRequirements();
      this.state.network.isBrowserSupported = result.detail.isBrowserSupported;
      const sdkAppId = this.state.sdkAppId;
      const userSig = this.state.userSig;
      const userId = this.state.userId;
      let isEnoughParams = true;
      if (!sdkAppId || !userSig || !userId) {
        isEnoughParams = false;
      }
      if (this.state.joinSuccess && isEnoughParams) {
        // todo: 加入房间后推流后，才能获取网络质量
        // this.rtcCore.getNetworkQuality().then(res => {
        //   const {uplink: status} = res;
        //   if (status) {
        //     this.state.network.packetLossRate = status.packetLossRate;
        //     this.state.network.rtt = status.rtt;
        //     this.state.network.status = status.networkGrade;
        //     this.state.network.statusText = NETWORK_QUALITY[this.state.network.status];
        //   }
        //   resolve();
        // })
        //     .catch((err) => {
        //       this.state.network.packetLossRate = '';
        //       this.state.network.rtt = '';
        //       this.state.network.status = 'UNKNOWN';
        //       this.state.network.statusText = NETWORK_QUALITY['UNKNOWN'];
        //       reject(err);
        //     });
        resolve();
      } else {
        this.state.network.rtt = '暂无';
        this.state.network.packetLossRate = '暂无';
        this.state.network.statusText = '暂无';
        // 暂不支持腾讯不加入房间检测网络质量
        reject(new Error('暂不支持腾讯不加入房间检测网络质量'));
      }
    });
  }
}

export default RtcDeviceService;
