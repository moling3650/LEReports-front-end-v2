import axios from 'axios'

function fetchFieldsByReportCode (reportCode) {
  return axios.get(`/DataAPI/Commom.ashx?ActType=GetColumns&reportCode=${reportCode}`).then(res => res.data)
}

function deleteReportField (reportCode, prop) {
  return axios.post('/DataAPI/ReportData.ashx?method=deleteReportField', { queryParams: {reportCode, prop}})
}

function saveReportField (reportField) {
  return axios.post('/DataAPI/ReportData.ashx?method=updateReportField', { queryParams: reportField })
}

function updateFieldsLabel (payload) {
  if (!payload.length) {
    return Promise.resolve()
  }
  const queryParams = {}
  const sql = payload.map((item, idx) => {
    queryParams[`label${idx}`] = item.label
    return `UPDATE B_Report_Field SET label = @label${idx} WHERE report_code = '${item.report_code}' AND prop = '${item.prop}'`
  }).join(';')
  return axios.post('/DataAPI/ReportData.ashx?method=updateFieldsLabel', { sql, queryParams })
}

export default {
  fetchFieldsByReportCode,
  deleteReportField,
  saveReportField,
  updateFieldsLabel
}
