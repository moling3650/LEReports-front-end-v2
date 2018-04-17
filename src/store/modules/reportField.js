import api from '@/apis/reportField'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  fields: state => state.all
}

// actions
const actions = {
  fetchFieldsByReportCode ({ commit }, reportCode) {
    if (!reportCode) {
      return commit('setFields', [])
    }
    return api.fetchFieldsByReportCode(reportCode).then(fields => commit('setFields', fields))
  },
  saveReportField ({ commit }, reportField) {
    return api.saveReportField(reportField).then(() => commit('updateReportField', reportField))
  }
}

// mutations
const mutations = {
  setFields (state, fields) {
    state.all = fields
  },
  updateReportField (state, reportField) {
    const index = state.all.findIndex(rf => rf.prop === reportField.prop)
    ~index && state.all.splice(index, 1, reportField)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
