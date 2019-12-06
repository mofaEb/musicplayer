<template>
  <div class="showInfo">
    <div class="info">
      <div class="info-img">
      </div>
      <p class="imfo-text">{{infoText}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoResult',
  props: {
    infoText: {
      type: String,
      default: '抱歉，暂无搜索结果'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'

  .showInfo
    position absolute
    display flex
    align-items center
    justify-content center
    top 40%
    width 100%
    .info
      height 150px
      width 100%
      .info-img
        height 100px
        bg-image('no-result')
        background-repeat no-repeat
        background-position center
        background-size contain
      .imfo-text
        height 50px
        line-height 50px
        text-align center
        color $color-text-d
</style>
