<template>
<div class="self-wrap">
  <page-header title="登陆"/>
  <a href="https://www.vue-js.com/signup" class="register">注册</a>
  <div class="self-content">
    <div>
      <span class="inpTips" v-if="isClick">请输入accessToken</span>
      <input type="password" v-model="val" :placeholder="isClick?'accessToken':'请输入accessToken'" ref="inp" @click="focus"/>
      <transition name="fade">
        <div class="line" :class="{'active':isClick}"></div>
      </transition>
      <span class="errorMes">{{failMes}}</span>
    </div>
    <div @click="login">登陆</div>
    <div class="help" @click="showTips">
      <span class="icon-question"></span>
      如何获取ACCESSTOKEN
    </div>
  </div>
  <transition name="show">
    <div class="tipShow" v-if="show">
      <span>登陆vue.js中文社区,在设置页面就可以看到自己accessToken</span>
      <span @click="show=false">关闭</span>
    </div>
  </transition>
</div>
</template>

<script>
  import PageHeader from './PageHeader'
  import * as types from '../../store/mutationTypes'
  import {mapGetters} from 'vuex'
    export default {
      data () {
          return {
            isClick: false,
            show: false,
            val: '',
            errorMes: ''
          }
      },
      components: {
        PageHeader
      },
      computed: {
        ...mapGetters(['failMes'])
      },
      methods: {
        focus () {
          this.isClick = !this.isClick
        },
        showTips () {
          this.show = !this.show
        },
        login () {
          // 获取accessToken到vuex模块self中
          this.$store.commit(types.GET_ACCESS_TOKEN, this.val)
          // vuex模块self对获取的accessToken进行验证并给出提示信息
          this.$store.dispatch('getSelfData')
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .self-wrap
    position relative
    width 100%
    overflow hidden
    .register
      position fixed
      top 0
      right 20px
      height 56px
      line-height 56px
      font-size 16px
      color #ff5252
    .self-content
      margin-top 60px
      & > div:nth-of-type(1)
        margin 160px auto 60px
        width 240px
        height 60px
        & > input
          padding 14px 0 8px 0
          border none
          outline none
          font-weight 600
          transition all 0.5s linear
        .line
          width 240px
          height 0
          border-bottom 1px solid #eee
          transition all 0.4s linear
          &.active
            border-bottom 1px solid red
          &.fade-enter, &.fade-leave-to
            width 0
        .inpTips, .errorMes
          font-size 12px
          color red
      & > div:nth-of-type(2)
        margin 0 auto
        width 88px
        height 36px
        line-height 36px
        text-align center
        border-radius 4px
        color #F8F9F9
        background #7E848C
        cursor pointer
      .help
        margin 30px auto
        width 198px
        height 36px
        line-height 36px
        text-align center
        box-shadow 0 1px 6px rgba(0, 0, 0, .1176), 0 1px 4px rgba(0, 0, 0, .1176)
        font-size 13px
        cursor pointer
        .icon-question
          margin-right 10px
          font-size 15px
          vertical-align middle
    .tipShow
      display flex
      position fixed
      bottom 0
      left 0
      z-index 100
      width 100%
      height 56px
      color #fff
      background rgba(0, 0, 0, 0.8)
      transition all 0.5s linear
      &.show-enter, &.show-leave-to
        transform translateY(100%)
      & > span:nth-of-type(1)
        flex 1
        margin 10px 40px 10px 16px
        font-size 13px
      & > span:nth-of-type(2)
        flex 0 0 56px
        height 56px
        line-height 56px
        color #ff5252
        cursor pointer
</style>
