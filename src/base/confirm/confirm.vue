<template>
  <div class="confirm" v-show="showFlag">
    <div class="confirm-wrapper">
      <div class="confirm-container">
        <div class="txt">{{ text }}</div>
        <div class="operate">
          <div class="operate-btn" @click="hide">{{ cancelBtnText }}</div>
          <div class="operate-btn" @click="confirm">{{ confirmBtnText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirm',
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    confirm () {
      this.$emit('confirm')
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .confirm
    position fixed
    z-index 998
    top 0
    bottom 0
    left 0
    right 0
    background-color $color-background-d
    .confirm-wrapper
      position absolute
      top 40%
      width 100%
      .confirm-container
        width 270px
        height 100%
        margin 0 auto
        background-color $color-highlight-background
        border-radius 15px
        text-align center
        .txt
          height 60px
          line-height 60px
          width 100%
        .operate
          display flex
          height 40px
          line-height 40px
          width 100%
          .operate-btn
            flex 1
</style>
