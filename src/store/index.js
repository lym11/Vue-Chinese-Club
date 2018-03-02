import Vue from 'vue'
import Vuex from 'vuex'
import homeContent from './module/homeContent'
import self from './module/self'
import topicContent from './module/topicContent'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state: {
  },
  modules: {
    homeContent,
    topicContent,
    self
  }
})
