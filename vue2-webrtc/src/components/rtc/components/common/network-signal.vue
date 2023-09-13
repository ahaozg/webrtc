<template>
  <div class="network-signal-wrapper"
       :class="{isAnimation}">
    <span class="rtc-icon-loading"
          v-if="isLoading && status === 'UNKNOWN'"></span>
    <ul class="com-network-signal"
        :class="`is-${status}`"
        v-else>
      <li class="network-item"></li>
      <li class="network-item"></li>
      <li class="network-item"></li>
      <li class="network-item"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'com-network-signal',
  // components
  components: {},
  // props
  props: {
    status: {
      type: String,
      default: 'UNKNOWN',
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    isAnimation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // name
      name: 'com-network-signal',
    };
  },
};
</script>

<style lang="less">
@import "../../assets/less/var.less";
.network-signal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;

  .rtc-icon-loading + .com-network-signal.is-UNKNOWN {
    align-items: center;
    justify-content: center;
  }

  .com-network-signal {
    display: flex;
    align-items: flex-end;
    width: 16px;
    height: 16px;
    gap: 1px;
    // 整体宽度16px, 设置前3个3，最后一个会分配到4px,防止出现小数，导致渲染异常
    .network-item:nth-child(1),
    .network-item:nth-child(2),
    .network-item:nth-child(3) {
      width: 3px;
    }

    &.is-UNKNOWN {
      .network-item {
        background-color: #595959;
      }
    }
    &.is-BAD,
    &.is-POOR {
      .network-item:nth-child(1) {
        background-color: @colorError;
      }
    }
    &.is-FAIR {
      .network-item:nth-child(1),
      .network-item:nth-child(2) {
        background-color: @colorWarn;
      }
    }
    &.is-GOOD {
      .network-item:nth-child(1),
      .network-item:nth-child(2),
      .network-item:nth-child(3) {
        background-color: @colorSuccess;
      }
    }
    &.is-EXCELLENT {
      .network-item:nth-child(1),
      .network-item:nth-child(2),
      .network-item:nth-child(3),
      .network-item:nth-child(4) {
        background-color: @colorSuccess;
      }
    }

    .network-item {
      width: 4px;
      height: 12px;
      background-color: rgba(255, 255, 255, .2);
      &:nth-child(1) {
        height: 4px;
      }
      &:nth-child(2) {
        height: 8px;
      }
      &:nth-child(3) {
        height: 12px;
      }
      &:nth-child(4) {
        height: 16px;
      }
    }
  }

  &.isAnimation {
    .com-network-signal.is-BAD,
    .com-network-signal.is-POOR {
      .network-item:nth-child(1) {
        animation: breathe 1s infinite;
      }
    }
    .com-network-signal.is-FAIR {
      .network-item:nth-child(1),
      .network-item:nth-child(2) {
        animation: breathe 1s infinite;
      }
    }
  }
}
</style>
