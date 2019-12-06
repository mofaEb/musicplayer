<template>
  <div class="recommend" ref="list">
    <scroll ref="scroll" class="scroll" :data="discData">
      <div >
        <div class="slider-wrapper">
          <slider :sliderList="sliderData">
          </slider>
        </div>
        <h1 class="disc-title">热门歌单推荐</h1>
        <div
          v-for="(item, index) in discData"
          :key="index"
          class="disc-wrapper"
          @click="selectDisc(item)">
          <div class="disc-items">
            <img @load="imgLoad" v-lazy="item.imgurl" class="item-img">
            <div class="item-text">
              <div class="text-title">{{ item.dissname }}</div>
              <div class='text-detail'> 由 {{ item.creator.name }} 创建</div>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!discData.length">
        <loading></loading>
      </div>
    </scroll>
    <transition-slide>
      <router-view></router-view>
    </transition-slide>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import TransitionSlide from 'base/transition/transition-slide'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { focusSlider } from 'common/js/recommend'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  name: 'Recommend',
  data () {
    return {
      sliderData: [],
      discData: [],
      checkLoad: false
    }
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderData = this._normalizeSliderData(res.focus.data.content)
          console.log(this.sliderData)
        }
      })
    },
    _normalizeSliderData (data) {
      let ret = []
      data.forEach ((item) => {
        const info = new focusSlider({
          url: item.pic_info.url,
          mid: item.jump_info.url
          })
        ret.push(info)
      })
      return ret
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discData = res.data.list
        }
      })
    },
    imgLoad () {
      if (!this.checkLoad) {
        this.$refs.scroll.refresh()
        this.checkLoad = true
      }
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectDisc (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      console.log(item)
      this.setDisc(item)
    }
  },
  components: {
    Slider,
    Scroll,
    Loading,
    TransitionSlide
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  @import '~stylus/mixin'
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .scroll
      overflow: hidden
      height: 100%
      .slider-wrapper
        overflow: hidden
        width: 100%
        height: 0
        padding-bottom: 40%
      .disc-title
        margin: 20px 0
        text-align: center
        font-size: $font-size-medium-x
        color: $color-theme
      .disc-wrapper
        width: 100%
        height: 0
        padding-bottom: 20%
        .disc-items
          // float: left
          display: flex
          margin: 20px 0
          color: white
          // justify-content: center
          .item-img
            display: inline-block
            margin: 0 20px
            height: 100%
            width: 20%
            vertical-align: top
          .item-text
            flex: 1
            height: 0
            padding-bottom: 20.8%
            position: relative
            display: inline-block
            .text-title
              margin: 5px 0
            .text-detail
              position:absolute
              left: 0
              bottom: 5px
              color: $color-text-d
              no-wrap()
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
