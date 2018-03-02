import * as types from '../mutationTypes'
import axios from 'axios'
const state = {
  url: 'https://www.vue-js.com/api/v1/',
  topicData: {},
  isLoading: false,
  id: ''
}
const getters = {
  topic: state => state.topicData,
  loading: state => state.isLoading
}
const mutations = {
  [types.GET_ID] (state, id) {
    state.id = id
  },
  [types.GET_TOPIC_DATA] (state, topicData) {
    state.topicData = topicData
    state.isLoading = true
  }
}
const actions = {
  getTopicData ({commit, state}, id) {
    // https://www.vue-js.com/api/v1/topic/5a54a4bc98e0e8c06cf1d949
    commit(types.GET_ID, id)
    axios.get(`${state.url}topic/${state.id}`)
      .then(res => {
        commit(types.GET_TOPIC_DATA, res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
