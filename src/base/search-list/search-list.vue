<template>
  <div class="search-list">
    <ul class="list">
      <li @click="selectItem(item)" class="list-item" v-for="(item, index) in searches" :key="index">
        <span class="item-text">{{ item }}</span>
        <span class="item-icon" @click.stop="deleteOne(index)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'SearchList',
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (index) {
      this.$emit('delete', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~stylus/variable'
  .list-item
    display flex
    align-items center
    margin 20px 0
    font-size $font-size-medium
    color: $color-text-ll
    .item-text
      flex 1
    .item-icon
      float right
</style>
