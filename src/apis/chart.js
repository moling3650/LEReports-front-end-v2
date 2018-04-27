import axios from 'axios'

function fetchChartsByReportCode (reportCode) {
  const payload = {queryParams: {reportCode}}
  return axios.post('/DataAPI/ReportData.ashx?method=fetchChartsByReportCode', payload).then(res => res.data)
}

function addChart (chart) {
  return axios.post('/DataAPI/ReportData.ashx?method=addChart', {queryParams: chart})
}

function updateChart (chart) {
  return axios.post('/DataAPI/ReportData.ashx?method=updateChart', {queryParams: chart})
}

function deleteChartById (id) {
  return axios.post('/DataAPI/ReportData.ashx?method=deleteChartById', {queryParams: {id}})
}

export default {
  addChart,
  updateChart,
  deleteChartById,
  fetchChartsByReportCode
}
