<template>
  <div class="song-list">
    <ul class="list-outer">
      <li class="list-inner" v-for="(song, index) in songs" :key="index" @click="selectItem(song, index)">
        <div class="icons" :class="getRankCls(index)" v-show="isTopRank">
          <span>{{ getRankText(index) }}</span>
        </div>
        <div class="inner-song">
          <h2 class="inner-titie">{{ song.name }}</h2>
          <div class="inner-desc">{{ getDesc(song) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    isTopRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getRankCls (index) {
      const className = index <= 2 ? `icon${index}` : ''
      return className
    },
    getRankText (index) {
      const textInfo = index > 2 ? index + 1 : ''
      return textInfo
    },
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getDesc (song) {
      return `${song.singer} · ${song.album}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .list-outer
    padding: 15px 0
    width 100%
    // background-color $color-background
    .list-inner
      display flex
      width 90%
      height 70px
      margin: 5px auto
      border-bottom: .3px solid $color-text-d
      .inner-song
        width 80%
        .inner-titie
          margin: 10px
        .inner-desc
          margin: 10px
          color $color-text-d
          font-size $font-size-medium
          no-wrap()
      .icons
        height 70px
        width 70px
        line-height 70px
        background-repeat no-repeat
        background-position center
        background-size 30px 30px
        color $color-theme
        text-align center
        font-size $font-size-large-x
        // background #000
        &.icon0
          bg-image('first')
        &.icon1
          bg-image('second')
        &.icon2
          bg-image('third')
</style>
