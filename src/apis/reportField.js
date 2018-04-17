import axios from 'axios'

function fetchFieldsByReportCode (reportCode) {
  return axios.get(`/DataAPI/Commom.ashx?ActType=GetColumns&reportCode=${reportCode}`).then(res => res.data)
}

function saveReportField (reportField) {
  return axios.post('/DataAPI/ReportData.ashx?method=updateReportField', { queryParams: reportField })
}

export default {
  fetchFieldsByReportCode,
  saveReportField
}
