/**
 *@file dataTable
 *@version 1.0.0
 *@author haozg
 *@createTime 2022/03/2
 *@updateTime 2020/03/2
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description 前端的数据字典表
 */

const dataTable = {
  // WKS(0, "未开始"), CSZ(1, "测试中"), YCS(2, "已测试"), ZSZ(3, "正式中"), YJS(4, "已结束"), WX(5, "无效"), SC(9, "删除");
  // 会议状态
  meetingStatusText:{
    0: '未开始',
    1: '测试中',
    2: '已测试',
    3: '正式中',
    4: '已结束',
    5: '无效',
    9: '删除',
  },
  meetingStatusNumber: {
    WKS: 0,
    CSZ: 1,
    YCS: 2,
    ZSZ: 3,
    YJS: 4,
    WX: 5,
    SC: 9,
  },
  // PREPARATION(1, "未开始"), PROGRESS(2, "进行中"), PAUSE(3, "暂停"), FINISHED(4, "结束");
  // 直播状态列表
  liveStatusText: {
    1: '未开始',
    2: '进行中',
    3: '暂停',
    4: '结束',
  },
  liveStatusNumber: {
    PREPARATION: 1,
    PROGRESS: 2,
    PAUSE: 3,
    FINISHED: 4,
  },
  // 窗口布局 GRID(1, "网格布局"), BORDER(2, "边框布局");
  layout: {
    GRID: '1',
    BORDER: '2',
  },
  layoutTransform: {
    1: 'GRID',
    2: 'BORDER',
  },
  // 用户角色
  meetingRole: {
    MODERATOR: '主持人',
    CO_MODERATOR: '主持人',
    MAINTENANCE: '场控',
    USER: '成员',
  },
  // 权限
  auths: {
    // 直播开关   --->  开启/关闭/暂停直播按钮
    authZbkg: 'rtc.live.zbkg',
    // 会议开关   --->  结束会议按钮
    authHykg: 'rtc.live.hykg',
    // 直播场景管理   --->  添加会议场景和场景配置管理；直播预览
    authCjgl: 'ept.meeting.live.cjgl',
    // 成员管理   --->  成员管理按钮显示的权限
    authCygl: 'rtc.live.cygl',
    // 秩序维护   --->  成员管理弹框里全体音视频的开启关闭、设为联席主持人、修改名称；
    authZxwh: 'rtc.live.zxwh',
    // 发言管理   --->  开启/关闭语音；开启/关闭视频
    authFygl: 'rtc.live.fygl',
    // 参会画面   --->  参会画面
    authChhm: 'ept.meeting.live.chhm',
    // 会议监控   --->  会议监控
    authHyjk: 'ept.meeting.live.hyjk',
    // 设置   --->  设置
    authSz: 'rtc.live.sz',
    // 配置视频字幕   --->  配置视频字幕按钮在互动会议室的显示权限
    authSpzy: 'ept.meeting.live.spzm',
    // 会议名签  --->  创建名签
    authCjmq: 'rtc.live.cjmq',
    // 窗口布局  --->  窗口布局
    authCkbj: 'rtc.live.ckbj',
    // 双击置顶  --->  双击置顶
    authSjzd: 'rtc.live.sjzd',
    // 切换rtc服务商
    authBgrtc: 'ept.meeting.live.bgrtc',
    // 踢人权限
    authKick: 'rtc.live.kick',
  },
  // 参会设备
  siteType: {
    pc: '2',
    miniProgram: '1',
  },
  monitorData: {
    'type': '',
    'description': '',
    'roomId': '',
    'userId': '',
    'token': '',
    'startTime': '',
    'startTimeTransform': '',
    'endTime': '',
    'endTimeTransform': '',
    'timeInterval': '',
    // 没有报错的话，Error字段为空字符串
    'Error': '',
    'OSInfo': '',
    'browserInfo': '',
    'deviceStartTime': '',
    'deviceStartTimeTransform': '',
    'deviceEndTime': '',
    'deviceEndTimeTransform': '',
    'deviceTimeInterval': '',
    'meetingResCode': '',
    'userResCode': '',
    'liveResCode': '',
    'qnToken': '',
    'qnTokenTime': '',
    'qnTokenTimeTransform': '',
    'isBrowserSupported': '',
    'createTrackParams': '',
    'localAudioOpen': '',
    'localVideoOpen': '',
    'networkInfo': '',
    'connectionState': '',
    'fpsLastTime': '',
    'fpsLastTimeTransform': '',
    'lastTime': '',
    'lastTimeTransform': '',
    'rtcCore_localTracks': '',
    'rtcCore_subscribeTracks': '',
    'userInRoom': '',
    'liveStatus': '',
    'liveFrameId': '',
    'activeFrameId': '',
    'resumedTracks': '',
    'track': '',
    'localAudioOpenText': '',
    'ErrorMessage': '',
    'successMessage': '',
    'localVideoOpenText': '',
    'videoFrameId': '',
    'publishParamsAudio': '',
    'publishParamsVideo': '',
    'audioTrackID': '',
    'videoTrackID': '',
    'liveUserID': '',
    'authTime': '',
    'authTimeTransform': '',
    'makeTrackMap': '',
    'makeTrackMapTime': '',
    'makeTrackMapTimeTransform': '',
    'lowQualityTracks': '',
    'url': '',
    'event': '',
    'message': '',
  },
};
export default dataTable;
