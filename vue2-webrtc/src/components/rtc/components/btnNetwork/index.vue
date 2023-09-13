<template>
  <div class="btn-opera c-btn-icon c-btn-icon--vertical btn-network"
       v-if="show"
       id="jsBtnNetworkArrow">
    <div class="l-top">
      <networkSignal
        :status="network.status"
        isAnimation />
      <cc-poptip
        link-id="jsBtnNetworkArrow"
        ref="refPoptip"
        class="rtc-poptip btn-network-poptip c-dropdown "
        transfer
        trigger="click"
        width="200px"
        placement="top">
        <ul class="c-dropdown-inner c-device-infos">
          <li class="device-info">
            <div class="device-left">延迟
              <span id="jsRttQuestion1" class="c-icon-question">延迟</span>
              <cc-poptip link-id="jsRttQuestion1"
                         class="rtc-poptip rtc-poptip-second"
                         transfer
                         trigger="hover"
                         width="425px"
                         placement="left">
                <div class="device-popover">
                  <div class="device-popover__content o-user-select-auto" v-text="term.rtt"></div>
                </div>
              </cc-poptip>
            </div>
            <div class="device-right"
                 :class="network.status === 'POOR' || network.status === 'BAD' ? 'ept-color-warn' : ''">
              <i class="rtc-icon-loading"
                 v-if="!network.rtt"></i>
              {{ network.rtt }}
            </div>
          </li>
          <li class="device-info">
            <div class="device-left">丢包率
              <span id="jsPacketLossRateQuestion1" class="c-icon-question">丢包率</span>
              <cc-poptip link-id="jsPacketLossRateQuestion1"
                         class="rtc-poptip rtc-poptip-second"
                         transfer
                         trigger="hover"
                         width="375px"
                         placement="left">
                <div class="device-popover">
                  <div class="device-popover__content o-user-select-auto" v-text="term.packetLossRate"></div>
                </div>
              </cc-poptip>
            </div>
            <div class="device-right"
                 :class="network.status === 'POOR' || network.status === 'BAD' ? 'ept-color-warn' : ''">
              <i class="rtc-icon-loading"
                 v-if="!network.packetLossRate"></i>
              {{ network.packetLossRate }}
            </div>
          </li>
          <li class="device-info">
          <div class="device-left">网络质量
            <span id="jsNetworkQuestion1" class="c-icon-question">网络质量</span>
            <cc-poptip link-id="jsNetworkQuestion1"
                       class="rtc-poptip rtc-poptip-second"
                       transfer
                       trigger="hover"
                       width="465px"
                       placement="left">
              <div class="device-popover">
                <div class="device-popover__content o-user-select-auto" v-text="term.networkQuality"></div>
              </div>
            </cc-poptip>
          </div>
          <div class="device-right"
               :class="network.status === 'POOR' || network.status === 'BAD' ? 'ept-color-warn' : ''">
            <i class="rtc-icon-loading" v-if="!network.statusText"></i>
            {{ network.statusText ? network.statusText : '' }}
          </div>
        </li>
        </ul>
      </cc-poptip>
    </div>
    <div class="l-bottom">网络状况</div>
  </div>
</template>

<script>
import mixinStore from './../../store/mixinStore';
import networkSignal from './../common/network-signal';
import ccPoptip from './../common/poptip/index.vue';
import rtcCore from './../../rtcCore';
import RtcDeviceNetwork from './../../rtcCore/RtcDeviceNetwork';

export default {
  name: 'btn-network',
  mixins: [mixinStore],
  // components
  components: {
    networkSignal,
    ccPoptip,
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
      name: 'btn-network',
      term: {
        rtt: '往返时延是网络请求从起点到目的地然后再回到起点所花费的时长（不包括接收端的处理时间）。',
        packetLossRate: '丢包率是指所丢失数据包数量占所发送数据包的比例。',
        networkQuality: '好：丢包率 <= 10% 并且 往返时延 <= 200ms\n一般：10% < 丢包率 <= 15% 并且 200ms < 往返时延 <= 400ms\n差：丢包率 >15% 或者 往返时延 > 400ms',
      },
      network: new RtcDeviceNetwork(),
    };
  },
  // computed
  computed: {},
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
      this.network = rtcCore.state.network;
    },
  },
};
</script>

<style lang="less">
.btn-network {

}
.btn-network-poptip {
  .device-info {
    line-height: 2;
  }
  .c-icon-question {
    height: 30px;
  }
}
</style>
