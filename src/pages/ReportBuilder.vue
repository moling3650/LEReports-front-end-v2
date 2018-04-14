<template>
  <div id="ReportBuilder">
    <reportEditor/>
  </div>
</template>

<script>
import reportEditor from '@/components/reportEditor'

export default {
  name: 'ReportBuilder',
  components: {
    reportEditor
  },
  created () {
    this.$store.dispatch('fetchReports')
    window.document.title = '报表编辑器'
  }
}
</script>
