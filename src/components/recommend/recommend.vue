<template>
  <div class="recommend">
    <scroll ref="scroll" class="scroll" :data="discData">
      <div >
        <div class="slider-wrapper">
          <slider :sliderList="sliderData.slider" picUrl="picUrl" linkUrl="linkUrl">
          </slider>
        </div>
        <h1 class="disc-title">热门歌单推荐</h1>
        <div v-for="(item, index) in discData" :key="index" class="disc-wrapper">
          <a :href="item.imgurl" class="disc-items">
            <img @load="imgLoad" v-lazy="item.imgurl" class="item-img">
            <div class="item-text">
              <div class="text-title">{{ item.dissname }}</div>
              <div class='text-detail'> 由 {{ item.creator.name }} 创建</div>
            </div>
          </a>
        </div>
      </div>
      <div class="loading-container" v-show="!discData.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  name: 'Recommend',
  data () {
    return {
      sliderData: {},
      discData: [],
      checkLoad: false
    }
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliderData = res.data
        }
      })
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
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
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
