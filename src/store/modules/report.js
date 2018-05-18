import api from '@/apis/report'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  reportOptions: state => state.all.map(r => ({ label: r.report_name, value: r.report_code })),
  getReportByCode: state => code => Object.assign({query_type: 1}, state.all.find(r => r.report_code === code))
}

// actions
const actions = {
  fetchReports ({ commit }) {
    return api.fetchReports().then(reports => commit('setReports', reports))
  },
  deleteReportByCode ({ commit }, code) {
    return api.deleteReportByCode(code).then(() => commit('removeReportByCode', code))
  },
  saveReport ({ commit }, report) {
    return api.saveReport(report).then(() => commit('updateReport', report))
  },
  validReportCode ({ commit }, code) {
    return api.validReportCode(code)
  }
}

// mutations
const mutations = {
  setReports (state, reports) {
    state.all = reports
  },
  removeReportByCode (state, code) {
    const index = state.all.findIndex(r => r.report_code === code)
    ~index && state.all.splice(index, 1)
  },
  updateReport (state, report) {
    const index = state.all.findIndex(r => r.report_code === report.report_code)
    state.all.splice(~index ? index : state.all.length, 1, report)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
