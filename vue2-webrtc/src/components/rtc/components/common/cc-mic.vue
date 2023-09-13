<template>
  <div class="cc-microphone svg-icon-wrap">
    <svgIcon v-show="isMute" icon-class="svg-audio-close"/>
    <svg v-show="!isMute"  aria-hidden="true" class="svg-icon" viewBox="0 0 20 22">
      <defs xmlns="http://www.w3.org/2000/svg">
        <linearGradient :id="`svg-audio-linearGradient-${linearGradientId}`" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop :offset="linearGradientStart.offset"
                :style="{'stop-color': linearGradientStart.color}"/>
          <stop :offset="linearGradientMiddle.offset"
                :style="{'stop-color': linearGradientMiddle.color}"/>
          <stop :offset="linearGradientMiddlePlus.offset"
                :style="{'stop-color': linearGradientMiddlePlus.color}"/>
          <stop :offset="linearGradientEnd.offset"
                :style="{'stop-color': linearGradientEnd.color}"/>
        </linearGradient>
      </defs>
      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="UIKIT" transform="translate(-964.000000, -6613.000000)">
          <g id="编组-41" transform="translate(964.000000, 6613.500000)">
            <g id="语音" transform="translate(0.000000, 1.500000)" fill-rule="nonzero">
              <rect id="矩形" fill="#000000" opacity="0" x="0" y="0" width="20" height="20"></rect>
              <!--eslint-disable-->
              <path d="M16.6403162,9.00015455 C16.6403162,12.47669 14.023888,15.4121928 10.6324537,15.8672921 L10.6776175,18.0000682 L13.6589668,18.0000682 C14.1830385,18.0000682 14.65273,18.4824871 14.65273,19.0000341 C14.65273,19.5176212 14.3183902,20 13.7943186,20 L9.68379446,20 L5.57327033,20 C5.0491987,20 4.71485892,19.5176212 4.71485892,19.0000341 C4.71485892,18.4824871 5.18457041,18.0000682 5.70864204,18.0000682 L8.68999141,18.0000682 L8.73513526,15.8672921 C5.34374088,15.4121928 2.72727273,12.47669 2.72727273,9.00015453 C2.72727273,8.99818736 2.72727273,9.06655663 2.72727273,9.06458946 C2.72727273,9.06360588 2.72727273,9.06360588 2.72727273,9.06262229 C2.72727273,8.54407165 3.03198873,8.00012845 3.72105585,8.00012845 C4.49115447,8.00012845 4.71481903,8.48254735 4.71481903,9.0001144 L4.71481903,9.0001144 C4.71627528,11.7608199 6.89018209,13.9991007 9.68373463,14.0000642 C12.4773071,13.9990806 14.6512339,11.7607999 14.6526702,9.0001144 L14.6526702,9.0001144 C14.6526702,8.48254735 15.1224016,8.00012845 15.6464733,8.00012845 C16.1705249,8.00012845 16.6403162,8.54405159 16.6403162,9.06262229 C16.6403162,9.06360588 16.6403162,9.06360588 16.6403162,9.06458946 C16.6403162,9.06653659 16.6403162,8.99818738 16.6403162,9.00015455 Z"
                    id="路径" fill="#D8D8D8"></path>
              <!--eslint-enable-->
            </g>
            <rect id="svg-audio-ellipse" :fill="`url(#svg-audio-linearGradient-${linearGradientId})`" x="6" y="0" width="7.5" height="14" rx="3.5"></rect>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import {getUUID} from './../../utils/utils';
import svgIcon from './svg-icon';

const percentMultiple = 100;
export default {
  name: 'com-microphone',
  components: {svgIcon},
  props: {
    // 是否静音
    isMute: {
      type: Boolean,
      default: true,
    },
    // 百分比的值
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 系数
      coefficient: 0.5,
      // 占比 4/5
      proportion: 0.8,
      // 渐变id
      linearGradientId: getUUID(),
      // 渐变色
      linearGradientStart: {
        offset: '0%',
        color: 'currentColor',
      },
      linearGradientMiddle: {
        offset: '50%',
        color: 'currentColor',
      },
      linearGradientMiddlePlus: {
        offset: '50.1%',
        color: 'currentColor',
      },
      linearGradientEnd: {
        offset: '100%',
        color: 'currentColor',
      },
      stopColorActive: '#6DD400',
      stopColorDefault: 'currentColor',
    };
  },
  computed: {
    // 百分比
    percent() {
      let result = 0;
      if (this.value >= this.coefficient) {
        result = this.proportion + (this.value - this.coefficient) * (1 - this.proportion) / this.coefficient;
      } else {
        result = this.value * this.proportion / this.coefficient;
      }
      return `${result * percentMultiple}%`;
    },
  },
  watch: {
    percent: {
      handler() {
        this.setLinearGradient();
      },
      immediate: true,
    },
  },
  methods: {
    // 设置渐变色
    setLinearGradient() {
      const stop = 0.1;
      const max = 100;
      const percentNumber = window.parseFloat(this.percent);
      if (percentNumber <= 0) {
        this.linearGradientStart.color = this.stopColorDefault;
        this.linearGradientMiddle.color = this.stopColorDefault;
        this.linearGradientMiddlePlus.color = this.stopColorDefault;
        this.linearGradientEnd.color = this.stopColorDefault;
      } else if (percentNumber >= max) {
        this.linearGradientStart.color = this.stopColorActive;
        this.linearGradientMiddle.color = this.stopColorActive;
        this.linearGradientMiddlePlus.color = this.stopColorActive;
        this.linearGradientEnd.color = this.stopColorActive;
      } else {
        this.linearGradientStart.color = this.stopColorActive;
        this.linearGradientMiddle.color = this.stopColorActive;
        this.linearGradientMiddle.offset = `${percentNumber}%`;
        this.linearGradientMiddlePlus.color = this.stopColorDefault;
        this.linearGradientMiddlePlus.offset = `${percentNumber + stop}%`;
        this.linearGradientEnd.color = this.stopColorDefault;
      }
    },
  },
};
</script>

<style lang="less">
.svg-icon {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
