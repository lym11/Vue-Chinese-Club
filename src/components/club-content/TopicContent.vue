<template>
<div class="topic-wrap" @click="menuShow=false">
  <div class="loading-wrap" v-if="!loading">loading...</div>
  <div style="position: relative;overflow: hidden" v-else>
    <!--页面头部-->
    <div class="topic-content-header">
        <div class="icon-arrow-left2" @click="goBack"></div>
        <h2>{{topic.title}}</h2>
        <div class="icon-menu" @click.stop="showMenu">
          <span></span><span></span><span></span>
        </div>
        <transition name="fade">
          <ul class="header-menu" v-if="menuShow">
            <li @click="toTop">顶部</li>
            <li @click="toReplyContent">评论区</li>
            <li @click="toReplyWriting">写评论</li>
            <li>
              <router-link to="home">返回首页</router-link>
            </li>
          </ul>
        </transition>
    </div>
    <!--话题标题-->
    <h3 class="topic-title">
      <span  class="topic-type" :class="{'highlight': topic.top || topic.good}">{{topic | typeTemplate}}</span>{{topic.title}}
    </h3>
    <!--作者介绍-->
    <div class="author-introduce">
      <router-link class="avatar-wrap" :to="{path: 'person', query:{user:topic.author.loginname}}">
        <img :src="topic.author.avatar_url" :alt="topic.author.loginname" width="40" height="40"/>
      </router-link>
      <div class="introduce-content">
        <p>
          <span>作者:&nbsp;{{topic.author.loginname}}</span>
          <span style="padding-left:16px">发表时间:&nbsp;{{topic.create_at | timeTemplate}}</span>
        </p>
        <p>
          <span>最后回复: &nbsp;{{topic.last_reply_at | timeTemplate}}</span>
          <span style="padding-left:16px">浏览量:&nbsp;{{topic.visit_count}}</span>
        </p>
      </div>
    </div>
    <!--收藏-->
    <div class="collect" v-if="key">
      <span class="icon-star-full" @click="toggleCollect(topic.id)" :class="{'collected':collected}"></span><span>{{collectText}}</span>
    </div>
    <!--话题正文-->
    <div class="topic-content" v-html="topic.content"></div>
    <!--留白区-->
    <div class="split"></div>
    <!--评论内容区-->
    <div class="topic-replies" ref="replyContent">
      <h4 class="replies-title">{{topic.replies.length}}条评论</h4>
      <ul>
        <li class="reply-item" v-for="(reply, index) in topic.replies" :key="index">
          <div>
            <router-link class="replier-avatar" :to="{path: 'person', query:{user:reply.author.loginname}}">
              <img :src="reply.author.avatar_url" :alt="reply.author.loginname" width="40" height="40"/>
            </router-link>
            <div class="replier-information">
              <strong>{{reply.author.loginname}}</strong><span>{{reply.create_at | timeTemplate}}</span>
            </div>
          </div>
          <p class="topic-text" v-html="reply.content"></p>
          <p>
            <span class="icon-thumb_up"
                  :class="{'up': up && upIndex ===index}"
                  @click="good(index)"></span><span>{{reply.ups.length}}</span>
          </p>
          <p><span class="icon-more" @click="showReply(index)"></span></p>
          <p class="reply-wrap" v-if="replyShow&&replyShowIndex===index">
            <textarea v-model="replyText"
                      :class="{'replying':replying}"
                      @focus="replying=true"
                      @blur="replying=false"></textarea>
              <span @click="replyOn(index)">确认</span><span @click="replyOff">取消</span>
          </p>
        </li>
      </ul>
    </div>
    <!--评论区-->
    <div class="reply-writing" ref="replyWriting">
      <textarea :class="{'active': commenting}" placeholder="这里输入评论内容" v-model="commentText" @focus="commenting=true" @blur="commenting=false"></textarea>
      <div @click="comment">评论</div>
    </div>
    <!--评论提示-->
    <div class="replyTips">
      <div v-if="!loginFirst">点赞评论及收藏文章请先登录</div>
      <transition name="tips">
        <div class="tips2" v-if="show">{{commentTips}}</div>
      </transition>
    </div>
  </div>
</div>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default {
      data () {
          return {
            commenting: false,
            replying: false,
            menuShow: false,
            replyContentOffsetTop: 0,
            replyWritingOffsetTop: 0,
            collect: false,
            collected: false,
            key: localStorage.getItem('accessToken'),
            collectText: '收藏',
            up: false,
            upIndex: null,
            commentSuccess: false,
            loginFirst: localStorage.getItem('accessToken'),
            commentText: '',
            replyText: '',
            show: false,
            replyShow: false,
            replyShowIndex: null
          }
      },
      created () {
        this.hasCollected()
      },
      beforeMount () {
        this.$store.dispatch('getTopicData', this.$route.query.id)
      },
      computed: {
        ...mapGetters(['topic', 'loading']),
        commentTips () {
          return this.commentSuccess ? '评论成功' : '评论失败!!'
        }
      },
      methods: {
        goBack () {
          this.$router.go(-1)
        },
        showMenu () {
          this.menuShow = true
        },
        // 去顶部
        toTop () {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        },
        // 去评论区
        toReplyContent () {
          this.$nextTick(() => {
            this.replyContentOffsetTop = this.$refs.replyContent.offsetTop - 20
            window.scrollTo(0, this.replyContentOffsetTop)
          })
        },
        // 去写评论区
        toReplyWriting () {
          this.$nextTick(() => {
            this.replyWritingOffsetTop = this.$refs.replyWriting.offsetTop + 60
            window.scrollTo(0, this.replyWritingOffsetTop)
          })
        },
        // 收藏和取消收藏操作  这里不将函数写在store中,因为这些函数是独有的
        toggleCollect (id) {
          this.collect = !this.collect
          let that = this
          if (!this.collect) {
            this.$axios.post('https://www.vue-js.com/api/v1/topic/collect', {
              accesstoken: that.key,
              topic_id: id
            }).then((res) => {
              this.collected = true
              this.collectText = '取消收藏'
            })
              .catch((err) => {
                console.log(err)
              })
          } else {
            this.$axios.post('https://www.vue-js.com/api/v1/topic/de_collect', {
              accesstoken: that.key,
              topic_id: id
            }).then((res) => {
              this.collected = false
              this.collectText = '收藏'
            })
          }
        },
        // 显示每一份帖子是否被收藏过
        hasCollected () {
          if (localStorage.getItem('accessToken')) {
            this.$axios.get('https://www.vue-js.com/api/v1/user/' + localStorage.getItem('loginName'))
              .then((res) => {
                let collectedTopic = res.data.data.collect_topics
                let id = this.$route.query.id
                collectedTopic.find((item) => {
                  if (id === item.id) {
                    this.collected = true
                    this.collectText = '取消收藏'
                  }
                })
              })
          }
        },
        // 为某个评论点赞
        good (index) {
          let replyId = this.$store.getters.topic.replies[index].id
          this.$axios.post('https://www.vue-js.com/api/v1/reply/' + replyId + '/ups', {
            accesstoken: localStorage.getItem('accessToken')
          })
            .then((res) => {
              // 重新加载数据,刷新页面
              this.up = true
              this.upIndex = index
              setTimeout(() => {
                this.up = false
                this.upIndex = null
              }, 500)
              this.$store.dispatch('getTopicData', this.$route.query.id)
            })
            .catch(() => {})
        },
        // 写评论
        comment () {
          let id = this.$route.query.id
          let text = this.commentText.trim()
          this.$axios.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
            accesstoken: localStorage.getItem('accessToken'),
            content: text
          })
            .then(res => {
              this.commentSuccess = true
              // 重新获取数据,刷新页面
              this.$store.dispatch('getTopicData', this.$route.query.id)
              this.show = true
              this.commentText = ''
              setTimeout(() => {
                this.show = false
              }, 2000)
            })
            .catch(() => {
              this.commentSuccess = false
              this.show = true
              setTimeout(() => {
                this.show = false
              }, 2000)
            })
        },
        // 显示评论输入框
        showReply (index) {
          this.replyShow = true
          this.replyShowIndex = index
          this.replyText = `@${this.$store.getters.topic.replies[index].author.loginname}  `
        },
        // 回复某人
        replyOn (index) {
          let id = this.$route.query.id
          let replyId = this.$store.getters.topic.replies[index].id
          let content = this.replyText
          this.$axios.post('https://www.vue-js.com/api/v1/topic/' + id + '/replies', {
            accesstoken: localStorage.getItem('accessToken'),
            content: content,
            reply_id: replyId
          })
            .then(() => {
              this.commentSuccess = true
              // 重新获取数据,刷新页面
              this.$store.dispatch('getTopicData', this.$route.query.id)
              this.replyShow = false
              this.replyText = ''
              this.show = true
              setTimeout(() => {
                this.show = false
              }, 2000)
            })
            .catch(() => {
              this.commentSuccess = false
              this.show = true
              setTimeout(() => {
                this.show = false
              }, 2000)
            })
        },
        // 取消回复
        replyOff () {
          this.replyShow = false
          this.replyText = ''
        }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .topic-wrap
    position relative
    margin-bottom 60px
    width 100%
    height 100%
    .topic-content-header
      position fixed
      top 0
      left 0
      z-index 50
      width 100%
      display flex
      padding 0 8px
      height 50px
      line-height 50px
      color #fff
      background #474a4f
      .icon-arrow-left2, .icon-menu
        flex 0 0 48px
        height 48px
        line-height 48px
        text-align center
        font-size 24px
        cursor pointer
      & > h2
        flex 1
        margin 0 8px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        font-size 20px
      .icon-menu
        box-sizing border-box
        padding 15px
        curson pointer
        & > span
          display block
          margin-bottom 3px
          width 4px
          height 4px
          border-radius 50%
          background #fff
      .header-menu
        position absolute
        top 2px
        right 8px
        padding 8px
        width 112px
        border-radius 4px
        box-shadow 0 1px 6px rgba(0, 0, 0, .1176), 0 1px 4px rgba(0, 0, 0, .1176)
        color #474a4f
        background #fff
        transition all 0.2s linear
        & > li
          padding 0 16px
          width 100%
          height 48px
          line-height 48px
          & > a
            color #474a4f
        &.fade-enter, &.fade-leave-to
          transform translateY(-100%)
    .topic-title
      margin-top 50px
      padding 20px
      font-size 18px
      font-weight bolder
      color #474A4F
      .topic-type
        display inline-block
        margin-right 6px
        padding 2px
        font-size 10px
        border-radius 2px
        color #fff
        background rgb(197, 197, 199)
        &.highlight
          background #369219
    .author-introduce
      display flex
      padding 6px 8px
      border-top 1px solid #ccc
      border-bottom 1px solid #ccc
      .avatar-wrap
        flex 0 0 40px
        margin-right 15px
        width 40px
        height 40px
        overflow hidden
        border-radius 50%
      .introduce-content
        flex 1
        line-height 20px
        font-size 12px
        color gray
    .collect
      margin-top 16px
      text-align center
      color #ccc
      .icon-star-full
        margin-right 20px
        font-size 18px
        vertical-align baseline
        color #ccc
        cursor pointer
        &.collected
          color #FF5252
    .topic-content
      padding 10px
      overflow hidden
      a
        color #FF5252
      .markdown-text
        & > h1
          margin 19px 0
          font-size 24px
          font-weight bolder
        & > h2
          margin 17px 0
          font-size 20px
          font-weight bold
        & > h3
          margin 14px 0
          font-size 18px
          font-weight bold
        & > h4
          margin 12px 0
          font-size 16px
          font-weight bold
        & > h5
          margin 10px 0
          font-size 14px
          font-weight bold
        & > p
          flex 1
          margin 14px 0
          padding 0 6px
          font-size 14px
          overflow hidden
        & > ul
          margin 14px 0
          padding-left 40px
          & > li
            margin 10px 0
            padding-left 10px
            list-style disc
            font-size 13px
            & li
              margin 4px 0 4px 16px
              padding-left 8px
              font-size 12px
              list-style circle
        .code
          font-family monospace,monospace
          overflow hidden
    .split
      width 100%
      height 16px
      background #EFF2F7
    .topic-replies
      padding-left 30px
      .replies-title
        margin 10px 10px 0 0
        padding 6px 4px
        font-size 16px
        border-left 3px solid #FA8072
        border-bottom 1px solid #dcdcdc
      .reply-item
        position relative
        margin 10px 10px 0 0
        padding-bottom 10px
        border-bottom 1px solid #dcdcdc
        & > div:nth-of-type(1)
          display flex
          .replier-avatar
            flex 0 0 40px
            width 40px
            height 40px
            margin-right 10px
            border-radius 50%
            overflow hidden
          .replier-information
            flex 1
            margin-top 10px
            & > strong
              margin-right 4px
              font-size 16px
              font-weight bold
            & > span
              font-size 12px
              color #444
        .topic-text
          padding 14px 0
          font-size 14px
          & a
            color #FF5454
        & > p:nth-of-type(2)
          position absolute
          top 0
          right 0
          font-size 14px
          color rgb(169, 169, 169)
          .icon-thumb_up
            margin-right 4px
            transition all 0.4s linear
            &.up
              color #3ba5ff
        & > p:nth-of-type(3)
          position absolute
          top 30px
          right 14px
          font-size 14px
          color rgb(169, 169, 169)
        .reply-wrap
          text-align center
          & > textarea
            margin-bottom 14px
            padding 12px 0 4px 0
            width 100%
            resize none
            border none
            border-bottom 1px solid #eee
            outline none
            &.replying
              border-bottom 1px solid #FF5454
          & > span
            display inline-block
            margin-right 6px
            width 88px
            height 36px
            line-height 36px
            text-align center
            border-radius 4px
            color #fff
            background #7E848C
            cursor pointer
    .reply-writing
      margin 10px 0 60px 0
      border-top 1px solid #ccc
      & > textarea
        display block
        margin 20px auto
        width 260px
        height 80px
        border none
        resize none
        outline none
        border-bottom 1px solid #eee
        &.active
          border-bottom 2px solid #ff5252
      & > div:nth-of-type(1)
        margin 30px auto
        width 80px
        height 36px
        line-height 36px
        text-align  center
        border-radius 4px
        color #fff
        background #7E848C
    .replyTips
      & > div:nth-of-type(1), .tips2
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
