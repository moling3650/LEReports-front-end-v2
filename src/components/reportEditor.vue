<template>
  <div id="reportEditor">
    <el-row class="row">
      <el-col :span="5">
        <el-select v-model="reportCode" clearable filterable placeholder="请选择报表" style="width: 95%">
          <el-option v-for="item in reportOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-button-group>
          <el-button @click="handleEditReport" :type="reportCode ? 'primary' : 'success'">
            {{ reportCode ? '编辑' : '新建' }}报表
          </el-button>
          <el-button :disabled="!reportCode" @click="handleDeleteReport" type="danger">删除报表</el-button>
          <el-button :disabled="!reportCode" @click="handleOpenReport">打开报表</el-button>
        </el-button-group>
      </el-col>

      <el-col v-show="reportCode" :span="5">
        <el-select v-model="chartId" clearable filterable placeholder="请选择图表" style="width: 95%">
          <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col v-show="reportCode" :span="6">
        <el-button-group>
          <el-button @click="handleEditChart" :type="chartId ? 'primary' : 'success'">
            {{ chartId ? '编辑' : '新建' }}图表
          </el-button>
          <el-button :disabled="!chartId" @click="handleDeleteChart" type="danger">删除图表</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col v-show="reportCode" :span="5">
        <el-select v-model="subReportId" clearable filterable placeholder="请选择图表" style="width: 95%">
          <el-option v-for="item in subReportOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col v-show="reportCode" :span="6">
        <el-button-group>
          <el-button @click="handleEditSubReport" :type="subReportId ? 'primary' : 'success'">
            {{ subReportId ? '编辑' : '新建' }}子报表
          </el-button>
          <el-button :disabled="!subReportId" @click="handleDeleteSubReport" type="danger">删除子报表</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <subReportForm :reportCode="reportCode" :subReportId="subReportId" ref="subReportDialog"/>
    <chartForm :reportCode="reportCode" :chartId="chartId" ref="chartDialog"/>
    <reportForm :reportCode.sync="reportCode" ref="reportDialog"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import subReportForm from '@/components/Forms/subReportForm'
import chartForm from '@/components/Forms/chartForm'
import reportForm from '@/components/Forms/reportForm'

export default {
  name: 'reportEditor',
  components: {
    subReportForm,
    chartForm,
    reportForm
  },
  computed: mapGetters([
    'reportOptions',
    'chartOptions',
    'subReportOptions'
  ]),
  data () {
    return {
      reportCode: '',
      chartId: '',
      subReportId: ''
    }
  },
  watch: {
    reportCode () {
      this.chartId = ''
      this.subReportId = ''
      this.$store.commit('setReportCode', this.reportCode)
      this.$store.dispatch('fetchFieldsByReportCode', this.reportCode)
      this.$store.dispatch('fetchChartsByReportCode', this.reportCode)
      this.$store.dispatch('fetchSubReportsByReportCode', this.reportCode)
    }
  },
  methods: {
    handleEditReport () {
      this.$refs.reportDialog.open()
    },
    handleDeleteReport () {
      this.$confirm('此操作将永久删除该报表, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        cancelButtonClass: 'el-button--danger',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => this.$message.info({ message: '已取消删除', showClose: true, duration: 1500 }))
        .catch(() => this.$store.dispatch('deleteReportByCode', this.reportCode)
          .then(() => this.$set(this, 'reportCode', ''))
          .then(() => this.$message.success({ message: '删除成功!', showClose: true, duration: 1500 }))
          .catch(() => this.$message.error({ message: '删除失败！', showClose: true, duration: 1500 }))
        )
    },
    handleOpenReport () {
      window.open(`${location.origin}${location.pathname}#/ReportQuerier?reportCode=${this.reportCode}`)
    },
    handleEditChart () {
      this.$refs.chartDialog.open()
    },
    handleDeleteChart () {
      this.$confirm('此操作将永久删除该图表, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        cancelButtonClass: 'el-button--danger',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => this.$message.info({ message: '已取消删除', showClose: true, duration: 1500 }))
        .catch(() => this.$store.dispatch('deleteChartById', this.chartId)
          .then(() => this.$set(this, 'chartId', ''))
          .then(() => this.$message.success({ message: '删除成功!', showClose: true, duration: 1500 }))
          .catch(() => this.$message.error({ message: '删除失败！', showClose: true, duration: 1500 }))
        )
    },
    handleEditSubReport () {
      this.$refs.subReportDialog.open()
    },
    handleDeleteSubReport () {
      this.$confirm('此操作将永久删除该子报表, 是否继续?', '提示', {
        confirmButtonText: '取消',
        cancelButtonText: '删除',
        cancelButtonClass: 'el-button--danger',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => this.$message.info({ message: '已取消删除', showClose: true, duration: 1500 }))
        .catch(() => this.$store.dispatch('deleteSubReportById', this.subReportId)
          .then(() => this.$set(this, 'subReportId', ''))
          .then(() => this.$message.success({ message: '删除成功!', showClose: true, duration: 1500 }))
          .catch(() => this.$message.error({ message: '删除失败！', showClose: true, duration: 1500 }))
        )
    }
  }
}
</script>

<style scoped>
#reportEditor {
  height: 88px;
}
.el-row {
  margin: 5px;
}
</style>
