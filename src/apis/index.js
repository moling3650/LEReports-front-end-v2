import axios from 'axios'

function fetchQueryControls () {
  return axios.get('/DataAPI/Commom.ashx?ActType=GetQueryControls').then(res => res.data)
}

export default {
  fetchQueryControls
}
