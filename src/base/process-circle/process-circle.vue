<template>
  <div class="process-circle" :style="circleStyle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="process-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="process-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="strokeLong"></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProcessCircle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    barPercent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    strokeLong () {
      return 314 * (1 - this.barPercent)
    },
    circleStyle () {
      return `height: ${this.radius}px`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .process-circle
    position relative
    // background-color #fff
    circle
      stroke-width 8
      transform-origin center
      &.process-background
        transform scale(0.9)
        stroke $color-theme-d
      &.process-bar
        transform scale(0.9) rotate(-90deg)
        stroke $color-theme
</style>
