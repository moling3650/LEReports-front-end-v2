import api from '@/apis/chart'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  chartOptions: state => state.all.map(c => ({ label: c.name, value: c.id })),
  getChartByID: state => id => state.all.find(c => c.id === id),
  charts: (state, rootGetters) => state.all.filter(c => c.state).map(c => {
    return {
      id: c.id,
      name: c.name,
      type: c.chart_type_code,
      label: c.label,
      value: c.value.split(',').map(v => rootGetters.fieldOptions.find(f => f.value === v)),
      state: c.state
    }
  })
}

// actions
const actions = {
  fetchChartsByReportCode ({ commit }, reportCode) {
    if (!reportCode) {
      return commit('setCharts', [])
    }
    return api.fetchChartsByReportCode(reportCode).then(charts => commit('setCharts', charts))
  },
  saveChart ({ commit, dispatch }, chart) {
    if (chart.id === 0) {
      return api.addChart(chart).then(() => dispatch('fetchChartsByReportCode', chart.report_code))
    } else {
      return api.updateChart(chart).then(() => commit('updateChart', chart))
    }
  },
  deleteChartById ({ commit }, id) {
    return api.deleteChartById(id).then(() => commit('removeChartById', id))
  }
}

// mutations
const mutations = {
  setCharts (state, charts) {
    state.all = charts
  },
  updateChart (state, chart) {
    const index = state.all.findIndex(c => c.id === chart.id)
    ~index && state.all.splice(index, 1, chart)
  },
  removeChartById (state, id) {
    const index = state.all.findIndex(c => c.id === id)
    ~index && state.all.splice(index, 1)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
