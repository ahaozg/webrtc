<template>
  <div class="rtc-device-network">
    <div class="o-inner">
      <div class="c-device-infos">
        <div class="device-info">
          <div class="device-left">操作系统</div>
          <div class="device-right"
               v-text="network.OSInfo ? network.OSInfo.osName : '正在检测'"></div>
        </div>
        <div class="device-info">
          <div class="device-left">浏览器版本</div>
          <div class="device-right"
               v-text="network.browser ? `${network.browser.browser} ${network.browser.version}` : '正在检测'"></div>
        </div>
        <div class="device-info">
          <div class="device-left">浏览器是否支持</div>
          <div class="device-right"
               v-text="network.isBrowserSupported ? '是' : '否'"></div>
        </div>
        <div class="device-info">
          <div class="device-left">延迟
            <span id="jsRttQuestion" class="c-icon-question">延迟</span>
            <cc-poptip link-id="jsRttQuestion"
                       class="rtc-poptip"
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
        </div>
        <div class="device-info">
          <div class="device-left">丢包率
            <span id="jsPacketLossRateQuestion" class="c-icon-question">丢包率</span>
            <cc-poptip link-id="jsPacketLossRateQuestion"
                       class="rtc-poptip"
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
        </div>
        <div class="device-info">
          <div class="device-left">网络质量
            <span id="jsNetworkQuestion" class="c-icon-question">网络质量</span>
            <cc-poptip link-id="jsNetworkQuestion"
                       class="rtc-poptip"
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
        </div>
      </div>
      <div class="device-result-text o-mt-gapBig">建议优先使用稳定的网络传输，比如插网线</div>
    </div>
    <div class="cc-dialog_footer" v-if="showFooterBtn">
      <span class="c-btn c-btn-default" @click="handleCancel">网络状况差</span>
      <span class="c-btn c-btn-primary" @click="handleConfirm">网络状况好</span>
    </div>
  </div>
</template>

<script>
import rtcCore from '../../rtcCore/index';
import ccPoptip from '../../components/common/poptip/index.vue';
import logger from '../../common/logger/index';
import RtcDeviceNetwork from '../../rtcCore/RtcDeviceNetwork';

const logPrefix = '[device-network]';

export default {
  name: 'rtc-device-network',
  // components
  components: {ccPoptip},
  // props
  props: {
    showFooterBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'rtc-device-network',
      term: {
        rtt: '往返时延是网络请求从起点到目的地然后再回到起点所花费的时长（不包括接收端的处理时间）。',
        packetLossRate: '丢包率是指所丢失数据包数量占所发送数据包的比例。',
        networkQuality: '好：丢包率 <= 10% 并且 往返时延 <= 200ms\n一般：10% < 丢包率 <= 15% 并且 200ms < 往返时延 <= 400ms\n差：丢包率 >15% 或者 往返时延 > 400ms',
      },
      network: new RtcDeviceNetwork(),
      loading: false,
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
    init() {
      this.loading = true;
      this.network = rtcCore.rtcDeviceService.state.network || {};
      rtcCore.rtcDeviceService.startNetworkTesting().then(() => {
        this.loading = false;
      })
        .catch(e => {
          logger.error(`${logPrefix}.init startNetworkTesting`, e);
        });
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
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";

.rtc-device-network {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 28px;

  .o-inner {
    padding: @gapBig 100px 0;
  }
}
</style>
