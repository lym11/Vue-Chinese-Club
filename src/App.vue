<template>
  <div id="app">
    <router-view/>
    <club-footer class="club-footer"/>
  </div>
</template>

<script>
import ClubFooter from './components/club-footer/ClubFooter'
import {mapGetters} from 'vuex'
export default {
  name: 'App',
  components: {
    ClubFooter
  },
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    position relative
    height 100%
</style>
