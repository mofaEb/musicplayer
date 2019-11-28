<template>
  <div class="lise-view">
    <ul
      class="bar"
      >
      <li
        class="bar-item"
        v-for="(item, index) in barData"
        ref="bar"
        :key="index"
        :data-index="index"
        :class="{'current': barIndex === index}"
        @touchstart="onBarTouchStart"
        @touchmove.stop.prevent="onBarTouchMove"
        @touchend="onBarTouchEnd"
      >
        {{ item[0] }}
      </li>
    </ul>
    <div class="scroll-outer" ref="list">
      <scroll
        ref="scroll"
        class="scroll"
        :data="data"
        :listenScroll="listenScroll"
        :probeType="probeType"
        @scroll="scroll">
        <div>
          <ul v-for="(group, index) in data" ref="listGroup" :key="index" class="singer-group">
            <li class="group-title" >{{ group.title }}</li>
            <li @click="selectItem(item)" class="group-item" v-for="(item, i) in group.items" :key="i">
              <img class="item-img" v-lazy="item.avatar">
              <p class="item-name">{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <div v-show="!data.length" class="loading-container">
          <loading></loading>
        </div>
      </scroll>
    </div>
    <div class="list-fixed" v-show="fixedTitleShow" ref="fixed">
      <h1 class="fixed-title">
        {{ fixedTitle }}
      </h1>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'

const ELEMENT_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  mixins: [playlistMixin],
  name: 'ListView',
  created () {
    this.touch = {}
    this.listenScroll = true
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      index: NaN,
      barIndex: 0,
      listHeight: [],
      diff: -1,
      fixedTop: 0
    }
  },
  props: {
    data: {
      type: Array
    },
    barData: {
      type: Array
    }
  },
  computed: {
    fixedTitle () {
      return this.barData[this.barIndex] ? this.barData[this.barIndex] : ''
    },
    fixedTitleShow () {
      if (this.scrollY > 0) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    // 导航栏滑动跳转
    onBarTouchStart (e) {
      this.index = e.target.getAttribute('data-index')
      this.touchStatus = true
      this.touch.y1 = e.touches[0].clientY
      this.touch.start = Number(e.target.getAttribute('data-index'))
    },
    onBarTouchMove (e) {
      this.touch.y2 = e.touches[0].clientY
      let offset = this.touch.y2 - this.touch.y1
      let offsetIndex = Math.floor(offset / ELEMENT_HEIGHT)
      this.index = this.touch.start + offsetIndex
    },
    onBarTouchEnd (e) {
      this.touchStatus = false
    },
    // 实时获取scroll 的 Y 坐标
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 获取高度列表
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      list.forEach((item) => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  watch: {
    // 延时获取高度列表
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },

    // 跳转
    index (index) {
      // 初始化 index 值
      index = index < 0 ? 0 : index
      index = index > this.barData.length ? this.barData.length : index

      const element = this.$refs.listGroup[index]
      this.$refs.scroll.scrollToElement(element)
    },

    // 获得当前所在位置的index
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.barIndex = 0
        return
      }
      // 在中间时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.barIndex = i
          this.diff = newY + height2
          return
        }
      }

      // 当滚动到底部时
      this.barIndex = listHeight.length - 1
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal <= TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      const diffDOM = this.$refs.fixed
      diffDOM.style.transform = `translateY(${fixedTop}px)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .bar
    display: flex
    position: fixed
    flex-direction: column
    justify-content: center
    top: 22%
    right: 0
    padding: 20px 2px
    font-size: $font-size-small
    color: $color-text-l
    background-color: $color-background-d
    border-radius: 5px
    z-index: 1
    .bar-item
      text-align: center
      height: 18px
      line-height: 18px
      padding: 0px 2px
    .current
      color: $color-theme
  .scroll-outer
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    // z-index: 0
    .scroll
      overflow: hidden
      height: 100%
      .group-title
        height: 30px
        line-height: 30px
        padding-left: 18px
        font-size: $font-size-medium
        color: $color-text-l
        background-color: $color-highlight-background
      .group-item
        height: 55px
        // line-height: 60px
        padding: 15px 30px
        .item-img
          height: 100%
          border-radius: 50%
        .item-name
          display: inline-block
          vertical-align: top
          padding-left: 20px
          line-height: 55px
          font-size: $font-size-medium-x
          color: rgba(255, 255, 255, 0.6)
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
  .list-fixed
    position: fixed
    height: 30px
    width: 100%
    line-height: 30px
    padding-left: 18px
    font-size: $font-size-medium
    color: $color-text-l
    background-color: $color-highlight-background
    // z-index: 0
</style>
