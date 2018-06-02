<template>
  <div id="ProcessReports">
    <div style="margin: 5px 15px; width: 400px">
      <mCascader label="工序" ex="SELECT G.group_code, G.group_name, M.process_code, P.process_name, M.report_code, R.report_name FROM S_Process_Report_Map M JOIN B_Report R ON R.report_code = M.report_code JOIN B_ProcessList P ON P.process_code = M.process_code JOIN B_WorkGroup G ON G.group_code = P.group_code WHERE M.report_group = 1 ORDER BY G.group_code, P.idx" @change="handleProcessChange"/>
    </div>
    <ReportQuerier v-if="code" :code="code"/>
    <div v-else class="empty">请先选择工序</div>
  </div>
</template>

<script>
import mCascader from '@/components/queryControls/mCascader'
import ReportQuerier from '@/pages/ReportQuerier'

export default {
  name: 'ProcessReports',
  components: {
    mCascader,
    ReportQuerier
  },
  data () {
    return {
      code: ''
    }
  },
  methods: {
    handleProcessChange (processCode) {
      this.code = processCode
    }
  }
}
</script>

<style scoped>
.empty {
  min-height: 300px;
  border: 1px solid #eee;
  margin: 5px 15px;
  text-align: center;
  font-size: 24px;
  line-height: 200px;
  color: #f56c6c;
  border-radius: 5px;
}
</style>
