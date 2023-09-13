<template>
  <div v-if="visible" class="loading loading-mask">
    <div class="loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
    </div>
    <div class="loading-text" v-text="content"></div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {count: 0};
  },
};
</script>

<style lang="less">
.loading.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 10000;
  //transform: translate(-50%, -50%);
  margin-top: -50vh;
  margin-left: -50vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;

  .loading-mask {
    position: absolute;
    z-index: 2000;
    background-color: hsla(0,0%,100%,.9);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
  .loading-spinner {
    position: relative;
    top: 0;
    margin-top: -21px;
    width: 100%;
    text-align: center;
  }
  .circular {
    height: 42px;
    width: 42px;
    animation: loading-rotate 2s linear infinite;
  }
  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90,150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #fff;
    stroke-linecap: round;
  }
  .loading-text {
    color: #fff;
    margin: 20px;
  }
}
</style>
