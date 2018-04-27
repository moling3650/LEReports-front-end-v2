import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/apis'
import chart from '@/store/modules/chart'
import report from '@/store/modules/report'
import reportField from '@/store/modules/reportField'

Vue.use(Vuex)

// initial state
const state = {
  queryControls: [],
  chartTypes: []
}

// getters
const getters = {
  queryControls: state => state.queryControls.map(qc => ({value: qc.control_code, label: qc.control_name})),
  chartTypes: state => state.chartTypes.map(ct => ({value: ct.code, label: ct.name}))
}

// actions
const actions = {
  fetchQueryControls ({ commit }) {
    return api.fetchQueryControls().then(qcs => commit('setQueryControls', qcs))
  },
  fetchChartTypes ({ commit }) {
    return api.fetchChartTypes().then(cts => commit('setChartTypes', cts))
  }
}

// mutations
const mutations = {
  setQueryControls (state, queryControls) {
    state.queryControls = queryControls
  },
  setChartTypes (state, chartTypes) {
    state.chartTypes = chartTypes
  }
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    chart,
    report,
    reportField
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
