'use strict';
const buildComponentBase = require('./build-component-base.js');
const _configOptions = {
    entry: {
        // 名称
        name: 'cc-rtc',
        // 入口文件
        path: './src/components/rtc/enter.js'
    },
    output: {
        // 输出路径
        path: '../src/components/rtc/dist'
    }

};
// 构建
buildComponentBase(_configOptions);
