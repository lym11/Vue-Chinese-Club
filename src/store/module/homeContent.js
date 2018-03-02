import * as types from '../mutationTypes'
import axios from 'axios'
const state = {
  url: 'https://www.vue-js.com/api/v1/',
  topicTabType: 'topics?tab=all',
  person: '',
  personData: {},
  data: {},
  isRefresh: false,
  refreshText: '',
  isLoadMore: false,
  loadMoreText: '',
  page: 1,
  loadIndicate: 0
}
const getters = {
  topicData: state => state.data,
  tab: state => state.topicTabType,
  user: state => state.personData,
  refreshState: state => state.isRefresh,
  refreshTips: state => state.refreshText,
  loadMoreState: state => state.isLoadMore,
  loadMoreTips: state => state.loadMoreText,
  indicate: state => state.loadIndicate
}
const mutations = {
  [types.GET_DATA] (state, data) {
    state.data = data
  },
  [types.GET_TOPIC_TAB] (state, tab) {
    state.topicTabType = tab
  },
  [types.GET_PERSON] (state, person) {
    state.person = person
  },
  [types.GET_PERSON_DATA] (state, personData) {
    state.personData = personData
  },
  [types.CHANGE_REFRESH_STATE] (state, {val, text}) {
    state.isRefresh = val
    state.refreshText = text
  },
  [types.CHANGE_LOAD_MORE_STATE] (state, {val, text}) {
    state.isLoadMore = val
    state.loadMoreText = text
  },
  [types.CHANGE_PAGE] (state) {
    state.page = ++state.page
    console.log(state.page)
  },
  [types.CHANGE_LOAD_INDICATE] (state, indicate) {
    state.loadIndicate = indicate
  },
  [types.ADD_DATA] (state, data) {
    state.data = [...state.data, ...data]
    console.log(state.data)
  }
}
const actions = {
  //  https://www.vue-js.com/api/v1/topics?tab=value(all, share, job....)
  getData ({commit, state}) {
    axios.get(state.url + state.topicTabType)
      .then(res => {
        commit(types.GET_DATA, res.data.data)
      })
      .catch(err => {
        console.log(err)
        alert('网址离家出走了')
      })
  },
  changeTab ({commit, state}, tab) {
    commit(types.GET_TOPIC_TAB, tab)
  },
  getPersonData ({commit, state}, person) {
    commit(types.GET_PERSON, person)
    // 用户信息网址: https://www.vue-js.com/api/v1/user/wangzhaokai
    axios.get(`${state.url}user/${state.person}`)
      .then(res => {
        commit(types.GET_PERSON_DATA, res.data.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  refresh ({commit, state}) {
    axios.get(state.url + state.topicTabType)
      .then(res => {
        commit(types.GET_DATA, res.data.data)
        commit(types.CHANGE_REFRESH_STATE, {val: true, text: '刷新完毕...'})
        commit(types.CHANGE_LOAD_INDICATE, 0)
        setTimeout(() => {
          commit(types.CHANGE_REFRESH_STATE, {val: false, text: ''})
        }, 500)
      })
      .catch(err => {
        console.log(err)
        commit(types.CHANGE_REFRESH_STATE, {val: true, text: '刷新失败...'})
        setTimeout(() => {
          commit(types.CHANGE_REFRESH_STATE, {val: false, text: ''})
        }, 500)
      })
  },
  loadMore ({commit, state}) {
    commit(types.CHANGE_PAGE)
    axios.get(state.url + state.topicTabType + `&page=${state.page}`)
      .then(res => {
        commit(types.ADD_DATA, res.data.data)
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
