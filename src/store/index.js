import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/apis'
import report from '@/store/modules/report'
import reportField from '@/store/modules/reportField'

Vue.use(Vuex)

// initial state
const state = {
  queryControls: []
}

// getters
const getters = {
  queryControls: state => state.queryControls.map(qc => ({value: qc.control_code, label: qc.control_name}))
}

// actions
const actions = {
  fetchQueryControls ({ commit }) {
    return api.fetchQueryControls().then(qcs => commit('setQueryControls', qcs))
  }
}

// mutations
const mutations = {
  setQueryControls (state, queryControls) {
    state.queryControls = queryControls
  }
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    report,
    reportField
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
