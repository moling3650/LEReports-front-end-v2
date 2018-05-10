import axios from 'axios'
import { Message } from 'element-ui'

function fetchQueryControls () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetQueryControls').then(res => res.data)
}

function fetchChartTypes () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetChartTypes').then(res => res.data)
}

function fetchData (payload) {
  return axios.post('/DataAPI/ReportData.ashx?method=FetchData', payload).then(res => {
    if (res.data.error) {
      Message.error({ message: res.data.message, showClose: true, duration: 5000 })
      return []
    }
    return res.data
  })
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
