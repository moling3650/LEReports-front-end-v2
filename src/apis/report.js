import axios from 'axios'

function fetchReports () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetReports').then(res => res.data)
}

function deleteReportByCode (code) {
  return axios.post('/DataAPI/ReportData.ashx?method=deleteReport', {queryParams: { report_code: code }})
}

export {
  fetchReports,
  deleteReportByCode
}
