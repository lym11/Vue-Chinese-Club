<template>
<div class="club-footer-wrap">
  <ul  class="club-footer">
    <li class="tab-item">
      <router-link to="/home">
        <span>
          <span class="icon-home"></span><br/>
          主页
        </span>
      </router-link></li>
    <li class="tab-item">
      <router-link to="/message">
        <span>
          <span class="icon-envelop"></span><br/>
        信息
        </span>
      </router-link>
    </li>
    <li class="tab-item">
      <router-link to="/self">
        <span>
          <span class="icon-user"></span><br/>
          我的
        </span>
      </router-link>
    </li>
    <li class="tab-item">
      <router-link to="/more">
        <span>
          <span class="icon-more"></span><br/>
          更多
        </span>
      </router-link>
    </li>
  </ul>
  <!-- 这里由于要实现水平和垂直响应式都居中,所以需要嵌套多层,比较麻烦 -->
</div>
</template>

<script>
    export default {
        data () {
            return {}
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .club-footer-wrap
    position fixed
    bottom 0
    left 0
    z-index 50
    width 100%
    background #fff
    .club-footer
      display flex
      width 100%
      height 56px
      .tab-item
        flex 1
        height 100%
        cursor pointer
        & > a
          display table
          margin 0 auto
          height 100%
          text-align  center
          color #bbb
          transition all 0.5s linear
          &.active
            color #7e848c
            transform scale(1.02)
          & > span
            display table-cell
            vertical-align middle
            & > span
              font-size 20px
</style>
