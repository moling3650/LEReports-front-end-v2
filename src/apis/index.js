import axios from 'axios'

function fetchQueryControls () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetQueryControls').then(res => res.data)
}

function fetchChartTypes () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetChartTypes').then(res => res.data)
}

function fetchData (payload) {
  return axios.post('/DataAPI/ReportData.ashx?method=FetchData', payload).then(res => res.data)
}

function fetchOptions (sql) {
  return axios.get(`/DataAPI/Commom.ashx?ActType=GetOptions&sql=${sql}`).then(res => res.data)
}

export default {
  fetchQueryControls,
  fetchChartTypes,
  fetchData,
  fetchOptions
}
