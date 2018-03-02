<template>
<div class="message-wrap">
  <page-header title="我的消息"/>
  <div class="login" v-if="!loginBarShow">请先登录</div>
  <div class="message-content">
    <div class="test"></div>
    <div class="test1"></div>
  </div>
</div>
</template>

<script>
  import PageHeader from './PageHeader'
    export default {
      data () {
          return {
            loginBarShow: localStorage.getItem('accessToken')
          }
      },
      mounted () {
      },
      components: {
        PageHeader
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .message-wrap
    position relative
    width 100%
    height 100%
    text-align center
    .login
      display inline-block
      margin 250px auto
      padding 6px 20px
      font-size 18px
      border-radius 6px
      background #474a4f
      color #fff
      cursor pointer
    .message-content
      display flex
      position absolute
      top 80px
      bottom 80px
      width 100%
      overflow hidden
      .test
        flex 0 0 80px
        width 80px
        backgroun red
      .test1
        flex 1
</style>
