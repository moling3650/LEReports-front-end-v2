import api from '@/apis/reportField'

// initial state
const state = {
  all: [],
  reload: false,
  options: []
}

// getters
const getters = {
  fields: state => state.all,
  fieldsReload: state => state.reload,
  fieldOptions: state => state.options,
  controls: state => state.all.filter(f => f.is_check).map(f => {
    return {
      type: f.control_code,
      span: f.control_span,
      prop: f.prop,
      label: f.label,
      required: f.required,
      ex: f.options_api
    }
  }),
  thead: state => state.all.filter(f => f.state).map(f => {
    return {
      prop: f.prop,
      label: f.label,
      width: f.width,
      align: f.align,
      state: f.state,
      idx: f.idx
    }
  }),
  fieldsType: state => {
    const types = {}
    state.all.filter(f => f.state).map(f => {
      const type = (f.options_api || '').toUpperCase().trim()
      if (type.startsWith('DECIMAL')) {
        types[f.prop] = 'DECIMAL'
      } else if (/^(\d{1,3}|DATETIME)$/i.test(type)) {
        types[f.prop] = 'DATETIME'
      } else {
        types[f.prop] = 'STRING'
      }
    })
    return types
  }
}

// actions
const actions = {
  fetchFieldsByReportCode ({ commit }, reportCode) {
    commit('setFieldsReload', true)
    if (!reportCode) {
      return commit('setFields', [])
    }
    return api.fetchFieldsByReportCode(reportCode).then(fields => commit('setFields', fields))
  },
  saveReportField ({ commit }, reportField) {
    return api.saveReportField(reportField).then(() => commit('updateReportField', reportField))
  },
  updateFieldsLabel ({ commit }, fields) {
    api.updateFieldsLabel(fields).then(() => commit('updateLabels', fields))
  }
}

// mutations
const mutations = {
  setFields (state, fields) {
    state.all = fields
    state.options = fields.filter(f => f.state).map(f => ({value: f.prop, label: f.label, state: f.state}))
  },
  updateReportField (state, reportField) {
    const index = state.all.findIndex(rf => rf.prop === reportField.prop)
    ~index && state.all.splice(index, 1, reportField)
  },
  setFieldsReload (state, reload) {
    state.reload = reload
  },
  updateFieldsState (state, checkList) {
    state.all.map(f => (f.state = checkList.find(c => c === f.prop) ? 1 : 0))
  },
  updateLabels (state, fields) {
    fields.map(f => {
      const index = state.all.findIndex(item => item.prop === f.prop)
      ~index && (state.all[index].label = f.label)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
