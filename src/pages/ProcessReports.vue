<template>
  <div id="ProcessReports">
    <div style="margin: 5px 15px; width: 400px">
      <mCascader label="工序" ex="SELECT DISTINCT W.group_code, W.group_name, R.report_code, R.report_name FROM S_PROCESS_TABLE_MAP M JOIN B_Report R ON M.TABLENAME = R.report_code JOIN B_ProcessList P ON P.process_code = M.OPERATION JOIN B_WorkGroup W ON W.group_code = P.group_code" @change="handleProcessChange"/>
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
