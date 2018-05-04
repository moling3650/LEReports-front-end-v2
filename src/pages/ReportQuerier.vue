<template>
  <div id="ReportQuerier">
  <queryBar :queryType="queryType" :report="reportCode" @search="search"/>
  <queryContent :loading="loading" :data="records"/>
  </div>
</template>

<script>
import api from '@/apis'
import reportApi from '@/apis/report'
import queryBar from '@/components/queryBar'
import queryContent from '@/components/queryContent'

export default {
  name: 'ReportQuerier',
  components: {
    queryBar,
    queryContent
  },
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  computed: {
    reportCode () {
      return this.code || this.$route.query.reportCode
    }
  },
  data () {
    return {
      queryType: 0,
      loading: false,
      records: []
    }
  },
  watch: {
    reportCode () {
      this.init()
    }
  },
  methods: {
    init () {
      this.records = []
      if (!this.reportCode) {
        return this.$message.error({message: '缺少报表编号', duration: 1500})
      }
      this.$store.dispatch('fetchFieldsByReportCode', this.reportCode)
      this.$store.dispatch('fetchChartsByReportCode', this.reportCode)
      reportApi.fetchReportByCode(this.reportCode).then(report => {
        window.document.title = report.report_name
        this.queryType = report.query_type
      })
    },
    search (payload) {
      this.loading = true
      api.fetchData(payload).then(data => {
        this.records = data
        this.loading = false
      })
    }
  },
  created () {
    this.init()
  }
}
</script>
