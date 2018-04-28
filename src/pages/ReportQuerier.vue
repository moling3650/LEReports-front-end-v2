<template>
  <div id="ReportQuerier">
  <queryBar :queryType="queryType" @search="search"/>
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
  computed: {
    reportCode () {
      return this.$route.query.reportCode
    }
  },
  data () {
    return {
      queryType: 0,
      loading: false,
      records: []
    }
  },
  methods: {
    search (payload) {
      this.loading = true
      api.fetchData(payload).then(data => {
        this.records = data
        this.loading = false
      })
    }
  },
  created () {
    if (!this.reportCode) {
      return this.$message.error({message: '缺少报表编号', duration: 0})
    }
    this.$store.dispatch('fetchFieldsByReportCode', this.reportCode)
    this.$store.dispatch('fetchChartsByReportCode', this.reportCode)
    reportApi.fetchReportByCode(this.reportCode).then(report => {
      window.document.title = report.report_name
      this.queryType = report.query_type
    })
  }
}
</script>
