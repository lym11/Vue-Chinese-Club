<template>
  <div class="person-wrap">
    <div class="person-header">
      <h2>个人中心</h2>
      <router-link to="message" class="icon-envelop-wrap"><div class="icon-envelop"></div></router-link>
    </div>
    <div class="person-introduce">
      <img :src="msg.avatar_url" :alt="msg.loginname" width="50" height="50"/>
      <div>
        <p id="name"><strong>{{msg.loginname}}</strong></p>
        <p>积分:&nbsp;&nbsp;{{msg.score}}</p>
        <p>注册时间:&nbsp;&nbsp;{{msg.create_at | timeTemplate}}</p>
      </div>
    </div>
    <ul class="person-message">
      <li>
        <div class="item-title">
          <span class="icon-file-text"></span>
          <h3>最近的话题</h3>
          <span>{{!msg.recent_topics?0:msg.recent_topics.length}}
            <span
              :class="topicsFold ? 'icon-keyboard_arrow_down':'icon-keyboard_arrow_up'"
              @click="foldTopics"></span>
          </span>
        </div>
        <ul class="item-content" v-show="!topicsFold" v-if="msg.recent_topics">
          <li v-for="(topic, index) in msg.recent_topics" :key="index">
            <router-link :to="{path:'topic-content',query:{id:topic.id}}">
              <span class="list-circle"><span></span><span></span></span>
              <h4>{{topic.title}}</h4>
              <span>{{topic.last_reply_at | timeTemplate}}</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <div class="item-title">
          <span class="icon-global"></span>
          <h3>最近的回复</h3>
          <span>{{!msg.recent_replies?0:msg.recent_replies.length}}
            <span
              :class="repliesFold ? 'icon-keyboard_arrow_down':'icon-keyboard_arrow_up'"
              @click="foldReplies"></span>
          </span>
        </div>
        <ul class="item-content" v-show="!repliesFold" v-if="msg.recent_replies">
          <li v-for="(topic, index) in msg.recent_replies" :key="index">
            <router-link :to="{path:'topic-content',query:{id:topic.id}}">
              <span class="list-circle"><span></span><span></span></span>
              <h4>{{topic.title}}</h4>
              <span>{{topic.last_reply_at | timeTemplate}}</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <div class="item-title">
          <span class="icon-star-full"></span>
          <h3>最近的收藏</h3>
          <span>{{!msg.collect_topics?0:msg.collect_topics.length}}
            <span
              :class="collectsFold ? 'icon-keyboard_arrow_down':'icon-keyboard_arrow_up'"
              @click="foldCollects"></span>
          </span>
        </div>
        <ul class="item-content" v-show="!collectsFold" v-if="msg.collect_topics">
          <li v-for="(topic, index) in msg.collect_topics" :key="index">
            <router-link :to="{path:'topic-content',query:{id:topic.id}}">
              <span class="list-circle"><span></span><span></span></span>
              <h4>{{topic.title}}</h4>
              <span>{{topic.last_reply_at | timeTemplate}}</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
    <div class="logout" @click="logout">退出登陆</div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        topicsFold: true,
        repliesFold: true,
        collectsFold: true
      }
    },
    created () {
      this.$store.dispatch('getSelfMsg')
    },
    computed: {
      ...mapGetters(['msg'])
    },
    methods: {
      foldTopics () {
        this.topicsFold = !this.topicsFold
      },
      foldReplies () {
        this.repliesFold = !this.repliesFold
      },
      foldCollects () {
        this.collectsFold = !this.collectsFold
      },
      logout () {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .person-header
    display flex
    padding 0 8px
    height 50px
    line-height 50px
    color #fff
    background #474a4f
    .icon-envelop-wrap
      display block
      flex 0 0 48px
      .icon-envelop
        height 48px
        line-height 48px
        text-align center
        font-size 24px
        color #fff
        cursor pointer
    & > h2
      flex 1
      margin 0 8px
      padding-left 70px
      text-align center
      font-size 20px
  .person-introduce
    display flex
    padding 8px 0 0 10px
    & > img
      flex 0 0 50px
    & > div:nth-of-type(1)
      flex 1
      padding-left 20px
      & > p
        font-size 12px
        color #757575
      #name
        font-size 15px
        color #222
        margin-bottom 2px
  .person-message
    .item-title
      display flex
      padding 16px 14px
      color #757575
      & > span:nth-of-type(1)
        flex 0 0 40px
        font-size 24px
      & > h3
        flex 1
        fone-size 20px
      & > span:nth-of-type(2)
        flex 0 0 48px
        text-align right
        .icon-keyboard_arrow_down
          font-size 18px
          cursor pointer
    .item-content
      padding 8px 0
      transition all 0.4s linear
      & > li
        position relative
        display flex
        margin 6px 6px 6px 0
        padding 16px 14px
        border 1px solid #ccc
        border-left none
        & > a
          color #474a4f
          & > h4
            flex 1
            display inline-block
            margin 0 4px 6px 0
            font-size 16px
          & > span:nth-of-type(2)
            flex 0 0 50px
            position absolute
            bottom 4px
            right 2px
            font-size 14px
            color #7e848c
          .list-circle
            flex 0 0 50px
            & > span:nth-of-type(1)
              display inline-block
              margin-right 4px
              width 6px
              height 6px
              border-radius 50%
              background #474a4f
            & > span:nth-of-type(2)
              display inline-block
              width 14px
              height 14px
              border-radius 50%
              border 2px solid #474a4f
  .logout
    margin 20px auto
    width 88px
    height 36px
    line-height 36px
    text-align center
    border-radius 2px
    background #7E848C
    color #fff
</style>
