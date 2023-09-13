import RtcUserInfo from './RtcUserInfo';
import emitter, {UIEvents} from '../common/emitter/event';

class RtcStore {
  camera = null;
  microphone = null;
  voice = null;
  network = null;

  mode = 'rtc';
  sdkAppId = '';
  userSig = '';
  roomId = '';
  userId = '';
  useStringRoomId = true;
  autoSubscribe = false;
  enableAutoPlayDialog = false;
  enableMic = false;
  enableCamera = false;
  enableScreenShare = false;

  joinSuccess = false;

  users = [];

  constructor() {
    this.init();
  }

  init() {
    this.camera = null;
    this.microphone = null;
    this.voice = null;
    this.network = null;

    this.mode = 'rtc';
    this.sdkAppId = '';
    this.userSig = '';
    this.roomId = '';
    this.userId = '';
    this.useStringRoomId = true;
    this.autoSubscribe = false;
    this.enableAutoPlayDialog = false;
    this.enableMic = false;
    this.enableCamera = false;
    this.enableScreenShare = false;

    this.joinSuccess = false;

    // 数组是为了vue2视图能够响应
    this.users = [];
  }

  reset() {
    this.init();
  }

  setUsers(user) {
    const defaultUser = new RtcUserInfo();
    const {userId} = user;
    const targetIdx = this.users.findIndex(u => u.userId === userId);
    let target = this.users[targetIdx];
    if (target) {
      target = {...defaultUser, ...target, ...user};
      this.users.splice(targetIdx, 1, target);
    } else {
      target = {...defaultUser, ...user};
      this.users.push(target);
    }
    emitter.emit(UIEvents.CHANGE_USER_ARRAY, {
      type: 'update',
      data: this.users,
    });
    return target;
  }

  delUsers({userId}) {
    const targetIdx = this.users.findIndex(u => u.userId === userId);
    const target = this.users[targetIdx];
    if (targetIdx !== -1) {
      this.users.splice(targetIdx, 1);
    }
    emitter.emit(UIEvents.CHANGE_USER_ARRAY, {
      type: 'delete',
      data: this.users,
    });
    return target;
  }

  getUser(userId = this.userId) {
    return this.users.find(u => u.userId === userId);
  }
}

export default RtcStore;
