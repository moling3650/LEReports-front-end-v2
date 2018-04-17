<template>
  <div id="ReportBuilder">
    <reportEditor/>
    <reportFieldEditor/>
  </div>
</template>

<script>
import reportEditor from '@/components/reportEditor'
import reportFieldEditor from '@/components/reportFieldEditor'

export default {
  name: 'ReportBuilder',
  components: {
    reportEditor,
    reportFieldEditor
  },
  created () {
    this.$store.dispatch('fetchReports')
    window.document.title = '报表编辑器'
  }
}
</script>
