import axios from 'axios'
import { Message } from 'element-ui'

axios.interceptors.response.use(function (res) {
  // Do something with response data
  if (res.data.error) {
    Message.error({ message: res.data.message, showClose: true, duration: 5000 })
    return { data: [] }
  }
  return res
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

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
