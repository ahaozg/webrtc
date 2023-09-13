/**
 * @version 1.0.0
 * @author haozg
 * @createTime 2023/05/10
 * @updateTime 2023/05/10
 * @see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 * @description 封装api接口
 */
import axios from 'axios';

import {apiSuccess,
  apiMeeting,
  apiUser,
  apiUpdate,
  apiUserList,
  apiSignature,
  apiVirtualType,
  apiToken,
  apiRight,
  apiRightPost,
  apiMeetingLeave,
  apiLivStatus,
  apiCustomData,
  apiCustomDataAdd,
  apiConferenceConfig} from './api';

// 前置拦截器
axios.interceptors.request.use(function (config) {
  // const _config = config || {};
  config.withCredentials = true;
  //  _config.headers['X-Requested-With'] = 'XMLHttpRequest';
  // // 如果启用全局事件
  // if (!_config.forbidGlobal) {
  //   // 执行全局函数
  //   if (_config.loadText) {
  //     ajax.globalBefore({text: _config.loadText});
  //   } else {
  //     ajax.globalBefore();
  //   }
  // }
  // // debugger
  // // 前置函数
  // if (typeof _config.before === 'function') {
  //   _config.before();
  // }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 后置拦截器
axios.interceptors.response.use(function (response) {
  // if (!response.config.forbidGlobal) {
  //   // 执行全局函数
  //   ajax.globalAfter();
  // }
  // // 后置函数
  // if (typeof response.config.after === 'function') {
  //   response.config.after();
  // }
  // // 判断请求返回的状态值
  // ajax.judgmentResponse(response);
  // 对响应数据做点什么
  return response;
}, function (error) {
  // if (error.config && !error.config.forbidGlobal) {
  //   // 执行全局函数
  //   ajax.globalAfter();
  // }
  // if (error && error.response) {
  //   // 判断请求返回的状态值
  //   ajax.judgmentResponse(error.response);
  // }
  // 对响应错误做点什么
  return Promise.reject(error);
});


/**
 * 加载视频会议信息
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiMeeting(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiMeeting(),
      // URL参数
      // 必须是一个纯对象或者 URL参数对象
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取当前参会用户信息
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiUser(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiUser(),
      // URL参数
      // 必须是一个纯对象或者 URL参数对象
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取当前参会用户信息
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function putApiUpdate(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'PUT',
      url: apiUpdate({roomId: params.roomId}),
      // URL参数
      // 必须是一个纯对象或者 URL参数对象
      data: params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取当前参会用户列表
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiUserList(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiUserList(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取加入房间的token --- 七牛/腾讯的token
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiSignature(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiSignature(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 返回虚拟用户类型
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiVirtualType(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiVirtualType(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取房间授权认证的token --- 业务系统的token
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiToken(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiToken(),
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 获取当前登录用户的权限字
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiRight(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiRight(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 校验参会人是否拥有指定权限
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiRightPost(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'POST',
      url: apiRightPost(),
      data: params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 加载视频会议信息
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiMeetingLeave(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiMeetingLeave(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 直播状态
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiLivStatus(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiLivStatus(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 查询房间自定义数据
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiCustomData(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiCustomData(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 添加房间自定义数据
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiCustomDataAdd(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiCustomDataAdd(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

/**
 * 加载互动会议室配置信息
 * @param {Object} params - 参数
 * @return {Promise} [data, error]
 */
export function getApiConferenceConfig(params) {
  return new Promise((resolve) => {
    axios.request({
      method: 'GET',
      url: apiConferenceConfig(),
      // URL参数
      params,
      // 默认值是json
      responseType: 'json',
    }).then(res => {
      if (apiSuccess(res?.data?.code)) {
        return resolve([res.data.data, null]);
      }
      resolve([null, res]);
    }, err => {
      resolve([null, err]);
    });
  });
}

