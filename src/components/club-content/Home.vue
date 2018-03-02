<template>
<div class="home-wrap">
  <ul class="home-tabs">
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=all'}" @click="selectTab('topics?tab=all')">全部</li>
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=good'}" @click="selectTab('topics?tab=good')">精华</li>
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=weex'}" @click="selectTab('topics?tab=weex')">weex</li>
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=share'}" @click="selectTab('topics?tab=share')">分享</li>
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=ask'}" @click="selectTab('topics?tab=ask')">问答</li>
    <li class="home-tabs-item" :class="{'active':tab==='topics?tab=job'}" @click="selectTab('topics?tab=job')">招聘</li>
  </ul>
  <div class="home-content-wrap" ref="scrollWrap">
    <transition name="fade1">
      <div class="pull-down"  v-if="refresh">{{refreshText}}</div>
    </transition>
    <ul class="home-content">
      <li class="home-content-item" v-for="(data, index) in topicData" :key="index">
        <router-link class="avatar-wrap" :to="{path:'person',query:{user:data.author.loginname}}">
          <img :src="data.author.avatar_url" width="30" height="30"/>
        </router-link>
        <router-link class="item-content-warp" :to="{path:'topic-content',query:{id:data.id}}">
          <div class="item-content">
            <h2>
              <span class="topic-type" :class="{'highlight': data.top || data.good}">{{data | typeTemplate}}</span>{{data.title}}
            </h2>
            <p>
              <span class="icon-bubble"></span>
              <span>{{data.reply_count}}</span>
              <span class="icon-eye"></span>
              <span>{{data.visit_count}}</span>
              <span class="time">{{data.last_reply_at | timeTemplate}}</span>
            </p>
          </div>
        </router-link>
      </li>
    </ul>
    <transition name="fade2">
      <div class="pull-up" v-if="loadMore">{{loadMoreText}}</div>
    </transition>
  </div>
</div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import IScroll from 'iscroll/build/iscroll-probe'
    export default {
      data () {
          return {
            loadingData: false, // 是否在加载数据
            state: 0, // state = 0 代表初始状态, state = 1 代表刷新 , state = 2 代表加载更多
            refresh: false, // 是否在刷新
            refreshText: '正在刷新...', // 刷新提示文字
            loadMore: false, // 是否在加载更多
            loadMoreText: '正在加载...' // 加载提示文字
          }
      },
      created () {
        this.$store.dispatch('getData')
        this.$nextTick(() => {
          this._initScroll()
          let self = this
          this.scrollWrap.on('scrollEnd', function () {
            // 满足刷新状态执行刷新函数和刷新时提示文字函数
            if (self.state === 1) {
              self.refreshTips(true, '正在刷新...')
              self.refreshData()
            }
            // 满足加载更多状态执行加载更多函数和加载更多提示文字函数
            if (self.state === 2) {
              self.loadMoreTips(true, '正在加载...')
              self.loadMoreData()
            }
          })
        })
      },
      updated () {
        this.$nextTick(() => {
          this._initScroll()
          let self = this
          this.scrollWrap.on('scroll', function () {
            if (this.y > 40 && self.loadingData === false) {
              self.state = 1
            }
            if (Math.floor(this.y) < this.maxScrollY - 100 && self.loadingData === false) {
              self.state = 2
            }
          })
        })
      },
      computed: {
        ...mapGetters(['topicData', 'tab'])
      },
      methods: {
        selectTab (tab) {
          this.$store.dispatch('changeTab', tab)
          this.$store.dispatch('getData')
        },
        // 初始化和实例化IScroll
        _initScroll () {
          this.scrollWrap = new IScroll(this.$refs.scrollWrap, {
            click: true,
            probeType: 3,
            mouseWheel: true,
            scrollY: true,
            useTransition: false
          })
        },
        refreshTips (state, text) {
          this.refresh = state
          this.refreshText = text
        },
        loadMoreTips (state, text) {
          this.loadMore = state
          this.loadMoreText = text
        },
        // 刷新函数
        async refreshData () {
          try {
            this.loadingData = true
            await this.$store.dispatch('getData')
            this.refreshTips(true, '刷新成功!')
            this.state = 0
            await setTimeout(() => {
              this.scrollWrap.refresh()
            }, 10)
            setTimeout(() => {
              this.refreshTips(false, '')
              this.loadingData = false
            }, 500)
          } catch (err) {
            this.refreshTips(true, '刷新失败!')
            setTimeout(() => {
              this.refreshTips(false, '')
            }, 500)
          }
        },
        // 加载更多函数
        async loadMoreData () {
          try {
            this.loadingData = true
            await this.$store.dispatch('loadMore')
            this.loadMoreTips(true, '加载成功!')
            this.state = 0
            await setTimeout(() => {
              this.scrollWrap.refresh()
            }, 10)
            setTimeout(() => {
              this.loadingData = false
              this.loadMoreTips(false, '')
            }, 500)
          } catch (err) {
            this.loadMoreTips(true, '加载失败!')
            setTimeout(() => {
              this.loadMoreTips(false, '')
            }, 500)
          }
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .home-wrap
    display flex
    position absolute
    top 0
    bottom 80px
    width 100%
    overflow hidden
    .home-tabs
      flex 1
      position fixed
      top 0
      left 0
      z-index 50
      display flex
      width 100%
      height 48px
      line-height 48px
      text-align center
      background #474a4f
      .home-tabs-item
        flex 1
        color #ccc
        border-1px(transparent)
        cursor pointer
        &.active
          color #eee
          &:after
            border-color #FF5252
    .home-content-wrap
      flex 1
      margin-top 60px
      width 100%
      background #EFF2F7
      .pull-down
        flex 1
        padding-left 140px
        width 100%
        height 40px
        line-height 40px
        font-size 14px
        color #FF5252
        background url("../../../static/refresh.gif") no-repeat 0 center #fff
        background-size 200px
        transition all 0.5s linear
        &.fade1-enter, &.fade1-leave-to
          opacity 0
      .pull-up
        position fixed
        bottom 60px
        left 0
        flex 1
        padding-left 140px
        width 100%
        height 40px
        line-height 40px
        font-size 14px
        color #FF5252
        background url("../../../static/refresh.gif") no-repeat 0 center #fff
        background-size 200px
        transition all 0.5s linear
        &.fade2-enter, &.fade2-leave-to
          opacity 0
      .home-content
        .home-content-item
          display flex
          margin-bottom 6px
          padding 10px
          background #fff
          .avatar-wrap
            flex 0 0 30px
            margin-right 10px
          .item-content-warp
            flex 1
            color #474A4F
            overflow hidden
            .item-content
              position relative
              & > h2
                font-size 14px
                font-weight bolder
                overflow hidden
                .topic-type
                  margin-right 6px
                  padding 2px
                  font-size 10px
                  border-radius 2px
                  color #fff
                  background rgb(197, 197, 199)
                  &.highlight
                    background #369219
              & > p:nth-of-type(1)
                padding-top 10px
                font-size 0
                color #989898
                & > span
                  font-size 14px
                .icon-eye
                  margin-left 8px
                .time
                  position absolute
                  bottom 0
                  right 0
</style>
