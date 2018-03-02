<template>
<div class="more-wrap">
  <page-header title="更多"/>
  <ul class="more-items">
    <li>
      <a href="https://www.vue-js.com/api/">
        <span class="icon-price-tags"></span>
        <span>项目API</span>
      </a>
    </li>
    <li>
      <a href="#">
        <span class="icon-star-full"></span>
        <span>项目地址</span>
      </a>
    </li>
    <li>
      <router-link to="publish">
        <span class="icon-paperplane"></span>
        <span>新建话题</span>
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
  import PageHeader from './PageHeader'
    export default {
      data () {
          return {}
      },
      components: {
        PageHeader
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.more-wrap
  position relative
  width 100%
  .more-items
    margin-top 56px
    color #474a4f
    & > li
      display flex
      padding 16px 16px 16px 22px
      & > a
        color #474a4f
        .icon-star-full, .icon-price-tags
          flex 0 0 48px
          font-size 20px
        & > span:nth-of-type(2)
          flex 1
          padding-left 20px
    & > li:nth-of-type(3)
      display flex
      .icon-paperplane
        flex 0 0 48px
        font-size 20px
      & > span:nth-of-type(2)
        flex 1
</style>
