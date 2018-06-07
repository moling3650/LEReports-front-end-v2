import axios from 'axios'

function fetchSubReportsByReportCode (reportCode) {
  const payload = {queryParams: {reportCode}}
  return axios.post('/DataAPI/ReportData.ashx?method=fetchSubReportsByReportCode', payload).then(res => res.data)
}

function addSubReport (subReport) {
  return axios.post('/DataAPI/ReportData.ashx?method=addSubReport', {queryParams: subReport})
}

function updateSubReport (subReport) {
  return axios.post('/DataAPI/ReportData.ashx?method=updateSubReport', {queryParams: subReport})
}

function deleteSubReportById (id) {
  return axios.post('/DataAPI/ReportData.ashx?method=deleteSubReportById', {queryParams: {id}})
}

export default {
  fetchSubReportsByReportCode,
  addSubReport,
  updateSubReport,
  deleteSubReportById
}
