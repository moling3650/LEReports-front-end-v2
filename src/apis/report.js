import axios from 'axios'

function fetchReports () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetReports').then(res => res.data)
}

function deleteReportByCode (code) {
  return axios.post('/DataAPI/ReportData.ashx?method=deleteReport', {queryParams: { report_code: code }})
}

function validReportCode (code) {
  return axios.post('/DataAPI/ReportData.ashx?method=validReport', {queryParams: { report_code: code }})
    .then(res => res.data.shift())
}

function saveReport (report) {
  return axios.post('/DataAPI/ReportData.ashx?method=saveReport', {queryParams: report})
}

export default {
  fetchReports,
  deleteReportByCode,
  validReportCode,
  saveReport
}
