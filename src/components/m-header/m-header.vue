<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Do-Ra Music</div>
    <router-link to="/user" tag="div" class="user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Mheader'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import "~stylus/mixin"
  .m-header
    // background-color: #ddd
    // position: relative
    height: 44px
    text-align: center
    color: $color-theme
    .icon
      display: inline-block
      // position: absolute
      // vertical-align: top
      margin: 6px 9px 0 0
      width: 30px
      height: 32px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display: inline-block
      // background-color: #fff
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .user
      position absolute
      top 10px
      right 10px
      font-size $font-size-large-x
</style>
