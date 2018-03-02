import axios from 'axios'
import * as types from '../mutationTypes'
import router from '../../router'
const state = {
  url: 'https://www.vue-js.com/api/v1/accesstoken',
  selfData: {},
  selfMsg: {},
  key: localStorage.getItem('accessToken'),
  inpTips: ''
}
const getters = {
  failMes: state => state.inpTips,
  msg: state => state.selfMsg
}
const mutations = {
  [types.GET_ACCESS_TOKEN] (state, key) {
    state.key = key
  },
  [types.GET_SELF_DATA] (state, data) {
    state.selfData = data
  },
  [types.GET_TOKEN_TIPS] (state, tips) {
    state.inpTips = tips
  },
  [types.GET_SELF_MSG] (state, msg) {
    state.selfMsg = msg
  }
}
const actions = {
  getSelfData ({commit, state}) {
    axios.post(state.url, {accesstoken: state.key})
      .then(res => {
        commit(types.GET_SELF_DATA, res.data)
        commit(types.GET_TOKEN_TIPS, '')
        localStorage.setItem('accessToken', state.key)
        localStorage.setItem('userId', res.data.id)
        localStorage.setItem('loginName', res.data.loginname)
        router.push('/self-mes')
      })
      .catch(err => {
        if (!state.key) {
          commit(types.GET_TOKEN_TIPS, 'accessToken不能为空')
        } else {
          commit(types.GET_TOKEN_TIPS, 'accessToken不正确,请重新输入')
        }
        console.log(err)
      })
  },
  getSelfMsg ({commit}) {
    axios.get('https://www.vue-js.com/api/v1/user/' + localStorage.getItem('loginName'))
      .then((res) => {
        commit(types.GET_SELF_MSG, res.data.data)
      })
  },
  logout ({commit}) {
    commit(types.GET_SELF_DATA, null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('loginName')
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
