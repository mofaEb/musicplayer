<template>
  <div class="process-container" @click="barClick">
    <div class="process" ref="bar">
      <div class="process-bar" :style="barStyle" >
        <div class="bar-btn"
              @touchstart="btnTouchStart"
              @touchmove="btnTouchMove"
              @touchend="btnTouchEnd"
        >
          <div class="bar-point"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessBar',
  props: {
    barPercent: {
      type: Number,
      default: () => 0
    },
    songTime: {
      type: Number,
      default: () => 0
    }
  },
  created () {
    this.touch = {}
    this.currentTime = 0;
  },
  mounted () {
    setTimeout(() => {
      this.barWidth = this.$refs.bar.clientWidth
    }, 3000)
  },
  computed: {
    barStyle () {
      return {width: `${this.barPercent * 100}%`}
    }
  },
  methods: {
    barClick(e)  {
      this.currentTime = this.songTime * (e.offsetX / this.barWidth)
      this.currentTime = Math.max(0, this.currentTime) && Math.min(this.songTime, this.currentTime)
      this.$emit('resetTime', this.currentTime)
    },
    btnTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.startPer = this.barPercent
      this.$emit('checkClick', this.touch.initiated)
    },
    btnTouchMove (e) {
      if (!this.touch.initiated ) {
        return
      }
      const offsetX = e.touches[0].pageX - this.touch.startX
      const offsetPer = offsetX / this.$refs.bar.clientWidth
      const newPer = this.touch.startPer + offsetPer
      this.currentTime = newPer * this.songTime
      this.currentTime = Math.max(0, this.currentTime)
      this.currentTime = Math.min(this.songTime, this.currentTime)
      this.$emit('showTime', this.currentTime)
    },
    btnTouchEnd (e) {
      this.touch.initiated = false
      this.$emit('checkClick', this.touch.initiated)
      this.$emit('resetTime', this.currentTime)
    }
  },
  watch: {
    // barPercent () {

    // }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .process-container
    padding 7px 0
    height 8px
    .process
      height 3px
      width 100%
      background-color rgba(0, 0, 0, 0.8)
      .process-bar
        position relative
        height 3px
        background-color $color-theme
        .bar-btn
          position absolute
          right -8px
          top -7.5px
          height 16px
          width 16px
          border-radius 50%
          background-color #fff
          .bar-point
            position absolute
            margin 3px
            height 10px
            width 10px
            border-radius 50%
            background-color $color-theme
</style>
