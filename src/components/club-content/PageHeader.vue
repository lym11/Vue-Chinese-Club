<template>
  <div class="page-header">
    <h2>{{title}}</h2>
  </div>
</template>

<script>
    export default {
      data () {
          return {}
      },
      props: {
        title: {
          type: String,
          required: true
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .page-header
    position fixed
    top 0
    padding 0 8px
    width 100%
    height 56px
    line-height 56px
    text-align center
    font-size 20px
    font-weight 400
    background #474a4f
    color #fff
</style>
