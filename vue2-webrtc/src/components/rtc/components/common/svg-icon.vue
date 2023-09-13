<template>
  <svg :class="svgClass" aria-hidden="true" @click="clickHandle($event)">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`;
      }
      return 'svg-icon';
    },
  },
  methods: {
    clickHandle(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style>
.svg-icon {
  width: 24px;
  height: 24px;
  /* vertical-align: -0.15em; */
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}

</style>
