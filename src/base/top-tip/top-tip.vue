<template>
  <div class="top-tip" v-show="showFlag" @click="hide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TopTip',
  data () {
    return {
      showFlag: false,
      timer: null
    }
  },
  methods: {
    show () {
      this.showFlag = true
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.hide()
        console.log(1)
      }, 3000)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .top-tip
    position fixed
    top 0
    left 0
    right 0
    height 50px
    background-color $color-dialog-background
</style>
