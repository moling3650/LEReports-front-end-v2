import axios from 'axios'

function fetchReports () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetReports').then(res => res.data)
}

export {
  fetchReports
}
