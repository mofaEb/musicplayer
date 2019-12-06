<template>
  <div class="wrapper">
    <swiper :options="swiperOption">
      <!-- slides -->
      <!-- <slot></slot> -->
      <swiper-slide v-for="(item, index) in sliderList" :key="index">
        <!-- <a :href="item[linkUrl]"> -->
          <img :src="item[picUrl]" class="swiper-img" @click="getAblum(item)">
        <!-- </a> -->
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getRecommendList } from 'api/recommend'

export default {
  name: 'Slider',
  data () {
    return {
      swiperOption: {
        pagination: { el: '.swiper-pagination' },
        loop: true,
        autoplay: true
      },
      ablumData: []
    }
  },
  props: {
    sliderList: {
      type: Array,
      default: []
    },
    albumMid: {
      type: String,
      default: ''
    },
    picUrl: {
      type: String,
      default: 'url'
    }
  },
  methods: {
    getAblum (item) {
      getRecommendList (item.mid).then((res) => {
      })
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="stylus" scoped>
  .wrapper >>> .swiper-pagination-bullet
    background: rgba(255, 255, 255, 0.5)
  .wrapper >>> .swiper-pagination-bullet-active
    width: 20px
    border-radius: 5px
    background rgba(255, 255, 255, 0.8)
  .swiper-img
    width: 100%
</style>
