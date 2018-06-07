import api from '@/apis/subReport'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  subReportOptions: state => state.all.map(sr => ({ label: sr.btn_text, value: sr.uid })),
  getSubReportByID: state => id => state.all.find(sr => sr.uid === id)
}

// actions
const actions = {
  fetchSubReportsByReportCode ({ commit }, reportCode) {
    if (!reportCode) {
      return commit('setSubReports', [])
    }
    return api.fetchSubReportsByReportCode(reportCode).then(subReports => commit('setSubReports', subReports))
  },
  saveSubReport ({ commit, dispatch }, subReport) {
    if (subReport.uid === 0) {
      return api.addSubReport(subReport).then(() => dispatch('fetchSubReportsByReportCode', subReport.report_code))
    } else {
      return api.updateSubReport(subReport).then(() => commit('updateSubReport', subReport))
    }
  },
  deleteSubReportById ({ commit }, id) {
    return api.deleteSubReportById(id).then(() => commit('removeSubReportById', id))
  }
}

// mutations
const mutations = {
  setSubReports (state, subReports) {
    state.all = subReports
  },
  updateSubReport (state, subReport) {
    const index = state.all.findIndex(sr => sr.uid === subReport.uid)
    ~index && state.all.splice(index, 1, subReport)
  },
  removeSubReportById (state, id) {
    const index = state.all.findIndex(sr => sr.uid === id)
    ~index && state.all.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
