<template>
  <div class="search-box" @click="focus">
      <i class="icon-search"></i>
      <input class="box" v-model="query" :placeholder="placeholder" ref="box"/>
      <i v-show="query" class="icon-dismiss" @click.stop="cleanQuery"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  name: 'SearchBox',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    focus () {
      this.$refs.box.focus()
    },
    blur () {
      this.$refs.box.blur()
    },
    cleanQuery () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  },
  created () {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
    .search-box
      position relative
      display flex
      align-items center
      height 40px
      width 100%
      border-radius 5px
      background-color $color-highlight-background
      color #111
      .icon-search
        margin 0 5px
        font-size 24px
        width 20px
      .icon-dismiss
        margin 0 5px
        width 20px
      .box
        flex 1
        line-height 18px
        margin 0 5px
        padding 0 3px
        color $color-text
        background-color $color-highlight-background
        font-size $font-size-medium
        &::placeholder
          color: $color-text-l
</style>
