import { fetchReports, deleteReportByCode } from '@/apis/report'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  reportOptions: state => state.all.map(r => ({ label: r.report_name, value: r.report_code }))
}

// actions
const actions = {
  fetchReports ({ commit }) {
    return fetchReports().then(reports => commit('setReports', reports))
  },
  deleteReportByCode ({ commit }, code) {
    return deleteReportByCode(code).then(() => commit('removeReportByCode', code))
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
