<template>
  <div class="tab">
    <router-link to="/recommend" tag="div" class="tab-item">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link to="/singer" tag="div" class="tab-item">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link to="/rank" tag="div" class="tab-item">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link to="/search" tag="div" class="tab-item">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Tab'
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .tab
    display flex
    position relative
    // background-color #fff
    line-height 44px
    height 44px
    .tab-item
      flex: 1
      // width 25%
      text-align center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
