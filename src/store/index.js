import Vue from 'vue'
import Vuex from 'vuex'
import report from '@/store/modules/report'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    report
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
