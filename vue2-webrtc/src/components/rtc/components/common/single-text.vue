<template>
  <div
    class="single-text"
    :style="{
      lineHeight: lineHeight,
      height: `${lineHeight}em`
    }">
    <span
      class="txt"
      :style="{maxHeight: `${lineHeight * 2}em`}"
      v-text="text"></span>
    <span
      class="title"
      :style="{top: `-${lineHeight * 2}em`}"
      :title="text"
      v-text="text"></span>
  </div>
</template>

<script>
export default {
  name: 'single-text',
  // props
  props: {
    text: {
      type: String,
      default: '',
    },
    lineHeight: {
      type: Number,
      default: 2,
    },
  },
};
</script>

<style lang="less">
.single-text {
  position: relative;
  overflow: hidden;
  .txt{
    display: block;
  }
  .title {
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: relative;
  }
}
</style>
