import axios from 'axios'

function fetchQueryControls () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetQueryControls').then(res => res.data)
}

function fetchData (payload) {
  return axios.post('/DataAPI/ReportData.ashx?method=FetchData', payload).then(res => res.data)
}

export default {
  fetchQueryControls,
  fetchData
}
