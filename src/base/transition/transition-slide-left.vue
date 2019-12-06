<template>
  <transition name="slide">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'TransitionSlide'
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all .3s linear
  .slide-enter, .slide-leave-to
    // transform: translateX(-100%)
</style>
