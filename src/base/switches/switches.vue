<template>
  <div class="body">
    <div class="tab-wrapper">
      <div class="tab">
        <div :class="leftCls" @click="clickTab(0)">{{ tabText[0] }}</div>
        <div :class="rightCls" @click="clickTab(1)">{{ tabText[1] }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import SearchList from 'base/search-list/search-list'

export default {
  name: 'Switches',
  props: {
    tabText: {
      type: Array,
      default: () => ['最近播放','搜索历史']
    }
  },
  data () {
    return {
      choose: 0
    }
  },
  computed: {
    leftCls () {
      const cls = this.choose ? 'no-choose' : 'be-choose'
      return cls
    },
    rightCls () {
      const cls = !this.choose ? 'no-choose' : 'be-choose'
      return cls
    }
  },
  methods: {
    clickTab (num) {
      this.choose = num
      this.$emit('getChoose', this.choose)
    }
  },
  components: {
    SearchList
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .body
    // position relative
    margin 0 auto
    width 90%
    .tab-wrapper
      width 100%
      // padding 25px 0
      .tab
        display flex
        height 30px
        width 220px
        margin 0px auto
        color $color-text-l
        .be-choose
          flex 1
          height 30px
          line-height 30px
          border 1px solid $color-text-l
          font-size $font-size-medium
          text-align center
          color $color-text
          background-color $color-dialog-background
        .no-choose
          flex 1
          height 30px
          line-height 30px
          border 1px solid $color-text-l
          font-size $font-size-medium
          text-align center
</style>
