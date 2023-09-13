<template>
  <div class="cc-inline-loading" v-if="loading">
    <span class="o-item"></span>
    <span class="o-item"></span>
    <span class="o-item"></span>
  </div>
</template>

<script>
export default {
  name: 'com-inline-loading',
  // components
  components: {},
  // props
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // name
      name: 'cc-inline-loading',
    };
  },
};
</script>

<style lang="less">
.cc-inline-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 100%;

  .o-item {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    animation: dotLoading 0.9s infinite;
  }

  .o-item:nth-child(1) {
    animation-delay: -0.3s;
  }

  .o-item:nth-child(2) {
    animation-delay: -0.6s;
  }

  .o-item:nth-child(3) {
    animation-delay: -0.9s;
  }
}

@keyframes dotLoading {
  0% {
    background-color: rgba(255, 255, 255, 0.6);
  }
  50% {
    background-color: rgba(255, 255, 255, 1);
  }
  0% {
    background-color: rgba(255, 255, 255, 0.6);
  }
}
</style>
