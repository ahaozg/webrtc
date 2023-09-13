<template>
  <div class="network-quality" :class="`level-${levelClass}`"></div>
</template>

<script>
// EXCELLENT 质量极好
// GOOD 用户主观感觉和极好差不多，但码率可能略低于极好
// FAIR 网络一般
// POOR 网络质量差，影响正常通信
// UNKNOWN 网络质量未知
const networkEmun = {
  EXCELLENT: 0,
  GOOD: 1,
  FAIR: 2,
  BAD: 3,
  POOR: 4,
  UNKNOWN: 5,
};
export default {
  name: 'network-quality',
  props: {
    // 级别
    level: {
      type: String,
      default: 'UNKNOWN',
    },
  },
  data() {
    return {};
  },
  computed: {
    levelClass() {
      return networkEmun[this.level];
    },
  },
};
</script>

<style lang="less">
.network-quality {
  display: inline-block;
  width: 36px;
  height: 22px;
  background-position: center;
  background-repeat: no-repeat;
  &.level-0,
  &.level-1 {
    background-image: url("./../../assets/images/wifi-good.png");
  }
  &.level-2 {
    background-image: url("./../../assets/images/wifi-fair.png");
  }
  &.level-3,
  &.level-4 {
    background-image: url("./../../assets/images/wifi-poor.png");
  }
  &.level-5 {
    background-image: url("./../../assets/images/wifi-unknown.png");
  }
}
</style>
