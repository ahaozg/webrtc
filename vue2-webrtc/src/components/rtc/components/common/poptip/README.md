# vcc-poptip
vue 自定义弹窗

本组件依赖于`@popperjs/core`，若安装本组件有关于`@popperjs/core`的报错，请安装`2.10.1`版本。



## Install
```bash
npm install --save @thunisoft/vcc-poptip
```

## 全局注册
```js
// main.js
// vccPoptip组件
// 引入js   
import vccPoptip from '@thunisoft/vcc-poptip';
// 使用组件
Vue.use(vccPoptip)
```

## 局部注册

```vue
<vcc-poptip> </vcc-poptip>

<script>
import vccPoptip from '@thunisoft/vcc-poptip';

export default {
  components: {
    'vcc-poptip': vccPoptip
  }
};

</script>
```


##  script 方式使用方案

1. 下载资源包
2. 找到dist下的js和css文件，复制到项目
3. 引入到项目， 注意 `vue`,必须在该js之前引入
4. 资源包下的test 文件夹有参考事例

```html
// css
    <link rel="stylesheet" href="./static/vcc-poptip.css">
//  js
<script src="./vue.js"></script>
<script src="./static/vcc-poptip.js"></script>

项目中使用

<vcc-poptip link-id="jsSection1Span1">
	测试文字
</vcc-poptip>
```

## 在线Demo
[demo](http://fd.thunisoft.com:9999/#/popup/poptip/case1)

## Browser support

包括不限于
		ie11、firefox(78.14.0esr)、chrome(94.0.4606.61)

## API

### Props
序号 | name |含义 | 类型 | 默认值| 
---| ---     | ------ | --- | --- |---
1 | value | 弹窗弹层默认是否展示 | Boolean | false | 
2 | linkId | 链接定位元素id | String |  | 
3 | trigger | 触发方式 | [Array, String] | click | 
4 | width | 弹窗宽度 | String |          | 
5 | hideArrow | 是否隐藏箭头  | Boolean         | false    | 
6 | transfer | 是否将弹层放置在`body`上  | Boolean         | false    | 
7 | popperClass | 自定义class,  您也可以直接使用class | String          |          | 
8 | offset | 偏移量 | Array           |          | 
9 | placement | 出现位置 | String          | bottom   | 
10 | strategy | 策略，absolute/fixed | String          | absolute | 
11 | onFirstUpdate | 创建完成后第一次更新后的回调   <br />ps:linkId变化后，会再次触发onFirstUpdate | Function        |          | 
12 | onShowFun | 展示时触发的回调 | Function        |          | 
13 | onHideFun | 隐藏时触发的回调 | Function        |          | 
14 | options | 自定义popperInstance的配置项，可参考 [官网](https://popper.js.org/) | Object          |          | 


### Events

序号 | 事件名   | 说明
---|---|---
1  | @change | 触发事件【弹窗弹层展示事件】   this.$emit('change', this.visible); 


### methods
序号  | 方法名称 | 说明
---  | ----    | --- 
1   | updatePopper | 更新Popper， 用于高频更新。 updatePopper() 
2   | forceUpdatePopper | 强制更新， 用于低频更新。  forceUpdatePopper() 
3   | setVisibleTrue | 设置visible为true。  setVisibleTrue() 
4   | setVisibleFalse | 设置visible为false。  setVisibleFalse() 


## 版本更新
-  1.0.0
   无
