import axios from 'axios'

function getMachineSatausByDate (startDate, endDate) {
  const url = '/DataAPI/Commom.ashx?ActType=GetMachineSatausByDate'
  return axios.get(url, { params: {startDate, endDate} }).then(res => res.data)
}

export default {
  getMachineSatausByDate
}
