<template>
  <div class="publish-wrap">
    <div class="cover" v-if="loginFirstShow">
      <div class="login-first">
        <h4>温馨提示:</h4>
        <p>{{tips}}</p>
        <p>
          <router-link to="home">
            <span>取消</span>
          </router-link>
          <router-link to="login">
            <span>确定</span>
          </router-link>
        </p>
      </div>
    </div>
    <page-header title="发布帖子"/>
    <div class="icon-arrow-left2" @click="goBack"></div>
    <div class="publish-nav">
      <a href="#" :class="{'active':current===0}" @click="toggleNav(0)">编辑</a>
      <a href="#" :class="{'active':current===1}" @click="toggleNav(1)">预览</a>
    </div>
    <div class="edit" v-if="current===0">
      <p class="topic-title">
        <span class="tips" ref="tips" v-if="!topicTitle">请写标题</span>
        <input type="text" @focus="tipsUp" @blur="tipsDown" :class="{'writeTitle':writeTitle}" v-model="topicTitle"/>
      </p>
      <p class="topic-type-tips" :class="{'active':selectedTab}">请选择板块</p>
      <div>
        <h4 class="selected" @click="inputTab" :class="{'active':selectedTab}">{{topicTab}}</h4>
        <div class="tabMenu" @click="inputTab"><span></span></div>
        <ul class="option-wrap" v-if="selectedTab">
          <li @click="selectTab('回答')" :class="{'active':topicTab === '回答'}">回答</li>
          <li @click="selectTab('分享')" :class="{'active':topicTab === '分享'}">分享</li>
          <li @click="selectTab('招聘')" :class="{'active':topicTab === '招聘'}">招聘</li>
        </ul>
      </div>
      <div class="topic-content-wrap">
        <h4 :class="{'active':writeContent}">正文</h4>
        <textarea  placeholder="建议使用Markdown语法"
                   :class="{'active':writeContent}"
                   @focus="inputContent"
                   @blur="writeContent=false"
                    v-model="topicContent"
        ></textarea>
      </div>
      <div class="publish-btn" @click="publish">发布</div>
    </div>
    <div class="preview" v-html="markedText" v-else></div>
    <div class="publish-tips">
      <transition name="tips">
        <div class="tips2" v-if="publishTipsShow">{{publishTipsText}}</div>
      </transition>
    </div>
  </div>
</template>

<script>
  import PageHeader from './PageHeader'
  import marked from 'marked'
    export default {
      data () {
          return {
            loginFirstShow: !localStorage.getItem('accessToken'),
            current: 0,
            tips: '请先登录',
            writeTitle: false,
            selectedTab: false,
            topicTab: '回答',
            writeContent: false,
            topicContent: '',
            topicTitle: '',
            markedText: '',
            publishTipsShow: false,
            publishSuccess: false
          }
      },
      components: {
        PageHeader
      },
      computed: {
        publishTipsText () {
          return this.publishSuccess ? '发布成功' : '发布失败'
        }
      },
      methods: {
        // 输入框聚焦,选择话题类型和失去焦点的动态显示效果
        toggleNav (val) {
          this.current = val
          this.markedText = marked(this.topicContent)
        },
        tipsUp () {
          this.$refs.tips.style.transform = `translateY(-28px)`
          this.$refs.tips.style.color = `#FF5252`
          this.$refs.tips.style.fontSize = `12px`
          this.writeTitle = true
          this.selectedTab = false
        },
        tipsDown () {
          this.$refs.tips.style.transform = `translateY(0)`
          this.$refs.tips.style.color = `#DBDEE2`
          this.$refs.tips.style.fontSize = `16px`
          this.writeTitle = false
        },
        selectTab (val) {
          this.topicTab = val
        },
        inputTab () {
          this.selectedTab = !this.selectedTab
        },
        inputContent () {
          this.writeContent = true
          this.selectedTab = false
        },
        // 返回上一页
        goBack () {
          this.$router.go(-1)
        },
        tipsShow () {
          this.loginFirstShow = true
          setTimeout(() => {
            this.loginFirstShow = false
          }, 3000)
        },
        showPublishTips () {
          this.publishTipsShow = true
          setTimeout(() => {
            this.publishTipsShow = false
          }, 3000)
        },
        publish () {
          if (this.topicTitle.trim().length < 10) {
            this.tips = '话题标题字数不能小于10位'
            this.tipsShow()
          }
          if (!this.topicContent) {
            this.tips = '话题内容不能为空'
            this.tipsShow()
          }
          let that = this
          this.$axios.post('https://www.vue-js.com/api/v1/topics', {
            accesstoken: localStorage.getItem('accessToken'),
            title: that.topicTitle,
            tab: that.topicTab,
            content: that.topicContent
          })
            .then(() => {
              this.publishSuccess = true
              this.showPublishTips()
            })
            .catch(() => {
              this.publishSuccess = false
              this.showPublishTips()
            })
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .publish-wrap
    position relative
    .cover
      position fixed
      top 0
      right 0
      bottom 0
      left 0
      z-index 200
      display flex
      background rgba(0, 0, 0, .4)
      .login-first
        margin auto
        width 75%
        max-width 768px
        border-radius 2px
        box-shoadow 0 19px 60px rgba(0, 0, 0, .298039), 0 15px 20px rgba(0, 0, 0, .219608)
        background #fff
        & > h4
          padding 24px 24px 20px
          line-height 32px
          font-size 22px
          font-weight 400
          color #474a4f
          letter-spacing 4px
        & > p:nth-of-type(1)
          padding 0 24px 20px 24px
          color rgba(71, 74, 79, .6)
        & > p:nth-of-type(2)
          padding 8px
          text-align center
          & > a
            display inline-block
            width 88px
            height 36px
            line-height 36px
            text-align center
            color #ff5252
    .icon-arrow-left2
      position fixed
      top 0
      left 20px
      margin-left 8px
      width 48px
      height 56px
      line-height 56px
      text-align center
      font-size 24px
      color #fff
      cursor pointer
    .publish-nav
      display flex
      margin-top 56px
      height 48px
      line-height 48px
      text-align center
      background #474A4F
      & > a
        flex 1
        color #C8C9CB
        transition all 0.1s linear
      .active
        border-bottom 2px solid #FF5252
        color #fff
    .edit
      &>div:nth-of-type(1)
        position relative
        .tabMenu
          &>span
            position absolute
            top 16px
            right 8px
            display inline-block
            border-width 6px
            border-style solid
            border-color #ccc transparent transparent transparent
            cursor pointer
      .topic-title
        position relative
        padding 28px 8px 12px 8px
        transition all 0.1s linear
        & > input
          width 100%
          border none
          outline none
          border-bottom 1px solid #eee
          &.writeTitle
            border-bottom 2px solid #FF5252
        .tips
          position absolute
          top 28px
          left 4px
          color #DBDEE2
          transition all 0.2s linear
      .topic-type-tips
        margin 20px 8px 6px 8px
        font-size 13px
        color #7e848c
        &.active
          color #FF5252
      .selected
        margin 0 8px
        line-height 32px
        border-bottom 1px solid #eee
        color #474a4f
        &.active
          border-bottom 2px solid #FF5252
      .option-wrap
        margin 0 8px
        padding 16px 24px
        line-height 32px
        border-radius 2px
        box-shadow 2px 1px 6px rgba(0, 0, 0, .1176), -2px -1px 4px rgba(0, 0, 0, .1176)
        transition all 0.2s linear
        & > li
          &.active
            color #FF5252
      .topic-content-wrap
        margin 20px 8px 0
        & > h4
          line-height 32px
          font-size 13px
          border-bottom 1px solid #eee
          color #7e848c
          &.active
            color #FF5252
        & > textarea
          margin 4px 0 10px 0
          width 100%
          min-height 120px
          resize none
          border none
          outline none
          border-bottom 1px solid #eee
          &.active
            border-bottom 2px solid #FF5252
      .publish-btn
        margin 0 auto
        width 88px
        height 36px
        line-height 36px
        text-align center
        border-radius 4px
        color #fff
        background #474a4f
        cursor pointer
    .publish-tips
      .tips2
        position fixed
        bottom 0
        left 0
        z-index 300
        padding 0 24px
        width 100%
        height 48px
        line-height 48px
        border-radius 24px
        color #fff
        background rgba(0, 0, 0, .87)
      .tips2
        transition all 0.1s linear
        &.tips-enter, &.tips-leave-to
          transform translateY(100%)
</style>
