<template>
  <div class="loading">
    <img class="loading-img" src="./loading.gif"/>
    <p class="loading-title">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .loading
    display: flex
    // overflow: hidden
    justify-content: center
    line-height: 30px
    height: 30px
    width: 100%
    .loading-img
      height: 100%
    .loading-title
      font-size: $font-size-medium
      color: $color-text-l
</style>
